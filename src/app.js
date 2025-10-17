import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import passwordRoutes from "./routes/password.routes.js";

dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/v1/password", passwordRoutes);

const PORT = process.env.PORT || 4000;

sequelize.sync({ force: false }).then(() => {
  console.log("Base de datos sincronizada");
  app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
});
