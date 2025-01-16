# File Chat

## Overview
This project is a **full-stack application** designed to create a chattable interface for PDF and DOCX documents. The system allows users to interact with document content as if they were chatting with a human assistant. Here's a breakdown of the tech stack:

### Frontend
- **Vite + React**: The frontend is built with Vite for fast development and React for building interactive UI components.

### Backend
- **Node.js + Express**: The backend server manages API routes, handles user authentication, and serves the frontend.
- **MongoDB**: Used as the database to store user data and metadata related to document processing.

### Language Model Backend
- **FastAPI**: A lightweight Python web framework is used to deploy a language model backend.
- **LangChain**: Powers the document-to-chat transformation by leveraging advanced language models.
- **Sentence-Transformers**: A Hugging Face model is used to extract meaningful embeddings from the document content, enabling effective querying and conversational responses.

## Features
1. Upload PDFs and DOCX files and convert them into a conversational interface.
2. Chat with the document content, retrieving contextually relevant information.
3. Real-time responses powered by LangChain and Sentence-Transformers.

## Architecture
1. **Frontend**: React-based UI communicates with the backend server via REST APIs.
2. **Backend Server**: Node.js Express handles frontend requests and communicates with MongoDB for data persistence.
3. **Language Model Backend**: A FastAPI service manages document processing and generates chat responses using Sentence-Transformers.

## Getting Started

Follow these steps to set up the project locally:

### Prerequisites
- **Node.js**: Version 14+ for the backend and frontend.
- **Python**: Version 3.8+ for the FastAPI model backend.
- **MongoDB**: Installed locally or a cloud-based instance (e.g., MongoDB Atlas).

### Installation

#### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd <repository-folder>
```

#### Step 2: Set Up the Backend Server
1. Navigate to the backend server folder:
   ```bash
   cd backend/server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/server` directory and add the following:
   ```env
   PORT=
   MONGODB_URI=
   FASTAPI_URL=http://0.0.0.0:8000
   FRONTEND_URI=
   SECRET=
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

#### Step 3: Set Up the Frontend
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory and add the following:
   ```env
   VITE_BACKEND_URL=
   VITE_CLOUDINARY_CLOUDNAME=
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

#### Step 4: Set Up the Language Model Backend
1. Navigate to the `backend/model` folder:
   ```bash
   cd backend/model
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend/model` directory and add the following:
   ```env
   CLOUDNAME=
   API_KEY=
   API_SECRET=
   ```
5. Run the FastAPI application:
   ```bash
   python main.py
   ```

### Step 5: Connect the Services
Ensure the backend server communicates with the FastAPI model backend and the frontend by configuring the appropriate URLs in the `.env` files as described above.

### Step 6: Run the Application
1. Open your browser and navigate to the frontend (default: `http://localhost:5173`).
2. Upload a PDF or DOCX file, and start interacting with the content through the chat interface.

## Contributing
Feel free to submit issues or pull requests to improve the project.
