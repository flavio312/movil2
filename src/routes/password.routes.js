import express from "express";
import { evaluatePassword } from "../controllers/password.controller.js";

const router = express.Router();

router.post("/evaluate", evaluatePassword);

export default router;