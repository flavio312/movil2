import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";

dotenv.config();
const app = express();

app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 4000;

sequelize.sync({ force: false }).then(() => {
  console.log("Base de datos sincronizada");
  app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
});
