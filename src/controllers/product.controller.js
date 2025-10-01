import Product from "../models/product.js";

export const createProduct = async (req, res) => {
  try {
    const { title, section, description,stock, price } = req.body;
    if (!title || !section || !description || !stock || !price) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }
    const product = await Product.create({ title, section, description,stock, price });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
