import FileChatModel from "../../models/FileChatModel.js";
import FileDataModel from "../../models/FileDataModel.js";
import UserModel from "../../models/UserModel.js";

async function FileChat(req) {
  try {
    const { fileId, userId, newChats } = req.body;

    if (!fileId || !userId || !Array.isArray(newChats) || newChats.length === 0) {
      return { success: false, message: "File ID, User ID, and new chats are required." };
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return { success: false, message: "User not found." };
    }

    const file = await FileDataModel.findById(fileId);
    if (!file) {
      return { success: false, message: "File not found." };
    }

    const validChats = newChats.every(
      (chat) =>
        chat.message &&
        chat.sender &&
        ["user", "system"].includes(chat.sender)
    );

    if (!validChats) {
      return {
        success: false,
        message: "Invalid chat format. Each chat must include 'message' and a valid 'sender' ('user' or 'system').",
      };
    }

    const updatedChat = await FileChatModel.findOneAndUpdate(
      { fileId, userId },
      { $push: { chats: { $each: newChats } } },
      { new: true, upsert: true }
    );

    return {
      success: true,
      message: "Chat updated successfully.",
      chat: updatedChat,
    };
  } catch (error) {
    console.error("Error updating chat:", error.message);
    return { success: false, message: "Internal server error." };
  }
}

export default FileChat;
