import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Product = sequelize.define("Product", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  section: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  stock: {type: DataTypes.INTEGER, defaultValue: 0},
  price: { type: DataTypes.FLOAT, allowNull: false },
});

export default Product;
