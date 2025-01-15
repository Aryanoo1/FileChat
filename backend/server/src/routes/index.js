import { Router } from "express";
import multer from "multer";

import GetAllFiles from "../controllers/GetAllFiles.js";
import FileChat from "../controllers/ChatController.js";
import FileComputation from "../controllers/FileComputation.js";
import FileQuery from "../controllers/FileQuery.js";
import UserVerify from "../controllers/UserVerify.js";
import GetChats from "../controllers/GetChats.js";
import registerUser from "../controllers/RegisterUser.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

router.post("/UserVerify", UserVerify)

router.post("/register", registerUser)

router.post("/get-all-files", GetAllFiles);

router.get("/file-chats", GetChats);

router.post("/file-chat", FileChat);

router.post("/file-computation", upload.single("file"), FileComputation);

router.post("/file-query", FileQuery);

export default router;
