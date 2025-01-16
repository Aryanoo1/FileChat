from fastapi import FastAPI, HTTPException
import os
import pickle
import requests
import zlib
from pydantic import BaseModel
from PyPDF2 import PdfReader
from docx import Document
from sentence_transformers import SentenceTransformer
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from transformers import pipeline
from langchain.chains import RetrievalQA
from langchain.llms import HuggingFacePipeline
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()


class Payload(BaseModel):
    chunkUrls: str
    query: str

cloudinary.config(
    cloud_name=os.getenv('cloud_name'),
    api_key=os.getenv('api_key'),
    api_secret=os.getenv('api_secret')
)

class HuggingFaceEmbeddings:
    def __init__(self, model_name):
        self.model = SentenceTransformer(model_name)

    def embed_documents(self, texts):
        return self.model.encode(texts, show_progress_bar=True)

    def embed_query(self, text):
        return self.model.encode([text], show_progress_bar=False)[0]

    # Add this method to make the object callable
    def __call__(self, texts):
        if isinstance(texts, str):
            return self.embed_query(texts)
        elif isinstance(texts, list):
            return self.embed_documents(texts)
        else:
            raise ValueError("Input to HuggingFaceEmbeddings must be a string or list of strings.")


@app.get("/process")
async def fetch_file(fileUrl: str):
    temp_file_path = "temp_file"

    response = requests.get(fileUrl)
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to fetch the file from the URL.")

    with open(temp_file_path, "wb") as f:
        f.write(response.content)

    content = ""
    try:
        if fileUrl.endswith(".pdf"):
            pdf_reader = PdfReader(temp_file_path)
            content = "".join(page.extract_text() or "" for page in pdf_reader.pages)

        elif fileUrl.endswith(".docx"):
            doc = Document(temp_file_path)
            content = "\n".join(paragraph.text for paragraph in doc.paragraphs)

        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Only .pdf and .docx are supported.")

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        chunks = text_splitter.split_text(text=content)

        embeddings = HuggingFaceEmbeddings("all-MiniLM-L6-v2")

        vector_store = FAISS.from_texts(chunks, embedding=embeddings)

        serialized_store = pickle.dumps(vector_store)
        compressed_store = zlib.compress(serialized_store)

        max_chunk_size = 10 * 1024 * 1024  # 10 MB
        chunks = [compressed_store[i:i + max_chunk_size] for i in range(0, len(compressed_store), max_chunk_size)]

        chunk_urls = []
        for idx, chunk in enumerate(chunks):
            upload_result = cloudinary.uploader.upload(
                file=chunk,
                resource_type="raw",
                public_id=f"{os.path.splitext(os.path.basename(fileUrl))[0]}_vectorstore_part_{idx}",
                overwrite=True,
                upload_preset="PdfToChat"
            )
            chunk_urls.append(upload_result["secure_url"])

        return {
            "message": "File processed successfully.",
            "chunkUrls": chunk_urls
        }

    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)


@app.post("/query")
async def answer_query(payload: Payload):
    try:
        chunk_urls = payload.chunkUrls.split(",")
        query = payload.query

        compressed_store = b"".join([requests.get(url).content for url in chunk_urls])
        vector_store = pickle.loads(zlib.decompress(compressed_store))

        hf_pipeline = pipeline("text2text-generation", model="google/flan-t5-base", tokenizer="google/flan-t5-base")

        llm = HuggingFacePipeline(pipeline=hf_pipeline)

        retriever = vector_store.as_retriever()
        chain = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=retriever)

        response = chain.invoke({"query": query})
        return {"question": query, "answer": response["result"]}

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch vector store chunks: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected server error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
