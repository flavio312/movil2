import Product from "../models/product.js";
import cloudinary from "../config/cloudinary.js";
import { Op } from "sequelize";

// Subir imagen a Cloudinary desde buffer
const uploadToCloudinary = (fileBuffer, folder, title) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [
          { width: 800, height: 600, crop: "fill" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
        tags: [title.toLowerCase().replace(/\s+/g, "-")],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );

    // Convertimos el buffer a stream
    stream.end(fileBuffer);
  });
};

// ✅ Crear producto (con o sin imagen)
export const createProduct = async (req, res) => {
  try {
    const { title, section, description, stock, price } = req.body;

    if (!title || !section || !description || !stock || !price) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, "productos-tienda", title);
    }

    const product = await Product.create({
      title,
      section,
      description,
      stock,
      price,
      imageUrl,
    });

    res.status(201).json({ msg: "Producto creado correctamente", product });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

// ✅ Obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Buscar productos (por título o sección)
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ msg: "Falta parámetro de búsqueda" });

    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${q}%` } },
          { section: { [Op.like]: `%${q}%` } },
        ],
      },
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Obtener producto por ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Actualizar producto (con opción de nueva imagen)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, section, description, stock, price } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    let imageUrl = product.imageUrl;

    // Si hay nueva imagen, la sube
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, "productos-tienda", title);
    }

    await product.update({
      title,
      section,
      description,
      stock,
      price,
      imageUrl,
    });

    res.json({ msg: "Producto actualizado correctamente", product });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }
    await product.destroy();
    res.json({ msg: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};