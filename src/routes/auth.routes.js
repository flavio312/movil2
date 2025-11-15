import express from "express";
import { register, login, getProfileById } from "../controllers/auth.controller.js";
import { upload } from "../services/cloudinary.service.js";

const router = express.Router();

router.post("/register", upload.single("avatar"), register);

router.post("/login", login);

router.get("/user/:id",getProfileById);

export default router;