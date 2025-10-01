import Product from "../models/product.js";

// Crear producto
export const createProduct = async (req, res) => {
  try {
    const { title, section, description, stock, price } = req.body;
    if (!title || !section || !description || !stock || !price) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }
    const product = await Product.create({ title, section, description, stock, price });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Obtener producto por ID
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

// Actualizar producto
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, section, description, stock, price } = req.body;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }
    await product.update({ title, section, description, stock, price });
    res.json(product);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }
    await product.destroy();
    res.json({ msg: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
