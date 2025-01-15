import axios from "axios";
import FileDataModel from "../../models/FileDataModel.js";
import UserModel from "../../models/UserModel.js";

async function FileComputation(req, res) {
  try {
    const { fileName, email, fileUrl } = req.body;

    if (!fileUrl || !fileName || !email) {
      return res.status(400).json({
        success: false,
        message: "File URL, file name, and email are required.",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const existingFile = await FileDataModel.findOne({
      fileName,
      uploadedBy: user._id,
    });

    if (
      existingFile &&
      existingFile.chunkUrls &&
      existingFile.chunkUrls.length > 0
    ) {
      return res.status(200).json({
        success: true,
        message: "File has already been computed.",
        fileData: existingFile,
      });
    }

    const response = await axios.get(`${process.env.FASTAPI_URL}/process`, {
      params: { fileUrl },
    });

    if (response.status !== 200) {
      return res.status(500).json({
        success: false,
        message: "Error occurred while processing file with FastAPI.",
        details: response.data,
      });
    }

    const { chunkUrls } = response.data;

    const newFileData = new FileDataModel({
      fileName,
      embeddings: [],
      fileUrl,
      uploadedBy: user._id,
      chunkUrls,
      metadata: {
        uploadedAt: new Date(),
        processedAt: null,
      },
    });

    await newFileData.save();

    res.status(201).json({
      success: true,
      message: "File processed and stored successfully.",
      fileData: newFileData,
    });
  } catch (error) {
    console.error("Error in FileComputation:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      details: error.message,
    });
  }
}

export default FileComputation;
