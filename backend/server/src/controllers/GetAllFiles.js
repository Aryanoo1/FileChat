import FileDataModel from "../../models/FileDataModel.js";
import UserModel from "../../models/UserModel.js";

async function GetAllFiles(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const files = await FileDataModel.find({ uploadedBy: user._id })
      .select("-chunkUrls")
      .lean();

    if (files.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No files found for this user." });
    }

    res.status(200).json({
      success: true,
      message: "Files retrieved successfully.",
      files,
    });
  } catch (error) {
    console.error("Error fetching files:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
}

export default GetAllFiles;
