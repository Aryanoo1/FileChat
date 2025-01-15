import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./config/db.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import router from "./src/routes/index.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URI],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      touchAfter: 24 * 3600,
    }),
  })
);

app.use("/api", router);

db().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
