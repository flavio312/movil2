import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import productRoutes from "./src/routes/product.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || '';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || "Error interno del servidor"
  });
});

sequelize.sync({ force: false }).then(() => {
  console.log('\n🗄️  Base de datos sincronizada');
  
  app.listen(PORT, () => {
    console.log(`   Servidor corriendo en puerto ${PORT}`);
  });
}).catch((error) => {
  console.error('❌ Error al sincronizar la base de datos:', error);
  process.exit(1);
});