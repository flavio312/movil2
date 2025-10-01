import express from "express";
import { createProduct, getProducts } from "../controllers/product.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, createProduct);
router.get("/", getProducts);
router.get("/:id", getProducts);
router.put("/:id", verifyToken, createProduct);
router.delete("/:id", verifyToken, createProduct);

export default router;
