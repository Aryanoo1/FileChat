import axios from "axios";
import FileDataModel from "../../models/FileDataModel.js";
import FileChat from "../controllers/ChatController.js";
import UserModel from "../../models/UserModel.js";

async function FileQuery(req, res) {
  try {
    const { email, fileId, question } = req.body;

    if (!fileId || !question) {
      return res.status(400).json({
        success: false,
        message: "File ID and question are required.",
      });
    }

    const fileData = await FileDataModel.findById(fileId);
    if (!fileData) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const { chunkUrls } = fileData;
    if (!chunkUrls || chunkUrls.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No chunk URLs found for the file.",
      });
    }

    const chunkUrlString = chunkUrls.join(",");

    const fastApiUrl = process.env.FASTAPI_URL;

    const payload = { chunkUrls: chunkUrlString, query: question };

    const response = await axios.post(`${fastApiUrl}/query`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 200) {
      return res.status(500).json({
        success: false,
        message: "Error occurred while querying the file with FastAPI.",
        details: response.data,
      });
    }

    const { answer } = response.data;

    const newChats = [
      { message: question, sender: "user" },
      { message: answer, sender: "system" },
    ];

    await FileChat({ body: { fileId, userId: user._id, newChats } });

    return res.status(200).json({
      success: true,
      message: "Query processed successfully and chat updated.",
      data: {
        question,
        answer,
      },
    });
  } catch (error) {
    console.error("Error in FileQuery:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      details: error.message,
    });
  }
}

export default FileQuery;
