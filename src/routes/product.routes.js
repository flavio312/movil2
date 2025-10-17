import express from "express";
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { upload } from "../services/cloudinary.service.js";

const router = express.Router();

// Crear producto con imagen
router.post("/", upload.single("imagen"), createProduct);

// Obtener todos los productos
router.get("/", getProducts);

// Obtener producto por ID
router.get("/:id", getProductById);

// Actualizar producto (sin imagen)
router.put("/:id", updateProduct);

// Eliminar producto
router.delete("/:id", deleteProduct);

export default router;
