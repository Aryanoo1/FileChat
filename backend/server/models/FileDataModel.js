import mongoose from "mongoose";

const fileDataSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: [true, "File name is required"],
    },
    fileUrl: {
      type: String,
      required: [true, "Original file link is required"],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileType: {
      type: String,
      default: "text/plain",
    },
    metadata: {
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
      processedAt: {
        type: Date,
        default: null,
      },
    },
    chunkUrls: {
      type: [String],
      required: [true, "Chunk URLs are required"],
    },
  },
  {
    timestamps: true,
  }
);

const FileDataModel = mongoose.model("FileData", fileDataSchema);
export default FileDataModel;
