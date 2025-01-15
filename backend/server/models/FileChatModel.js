import mongoose from "mongoose";

const fileChatSchema = new mongoose.Schema(
  {
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FileData",
      required: [true, "File ID is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    chats: [
      {
        message: {
          type: String,
          required: [true, "Message content is required"],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        sender: {
          type: String,
          enum: ["user", "system"],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const FileChatModel = mongoose.model("FileChat", fileChatSchema);
export default FileChatModel;
