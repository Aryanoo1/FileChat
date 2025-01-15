import FileChatModel from "../../models/FileChatModel.js";
import UserModel from "../../models/UserModel.js";

async function GetChats (req, res) {
  const { fileId, email } = req.query;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const fileChats = await FileChatModel.findOne({
      fileId,
      userId: user._id,
    });

    if (!fileChats || fileChats.chats.length === 0) {
      return res.status(200).json({
        success: true,
        chats: [],
        message: "Start Conversation",
      });
    }

    res.status(200).json({
      success: true,
      chats: fileChats.chats,
    });
  } catch (error) {
    console.error("Error fetching chats:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default GetChats;