import mongoose from "mongoose";
import UserModel from "../models/UserModel.js";
import FileDataModel from "../models/FileDataModel.js";
import FileChatModel from "../models/FileChatModel.js";

async function db() {
  try {
    await mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => {
        console.log("MongoDB Connected.");
      })
      .catch((err) => {
        console.log("Error connecting to the database", err);
      });
  } catch (err) {
    console.log("Something is wrong", err);
  }
}

export default db;
