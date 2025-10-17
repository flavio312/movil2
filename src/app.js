import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import passwordRoutes from "./routes/password.routes.js";
import { setupSwagger } from "./config/swagger.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar Swagger/OpenAPI
setupSwagger(app);

// Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/v1/password", passwordRoutes);

// Ruta raíz con información de la API
app.get("/", (req, res) => {
  res.json({ 
    message: "🔐 API de Seguridad de la Información",
    version: "1.0.0",
    documentation: {
      swagger: `${req.protocol}://${req.get('host')}/api-docs`,
      openapi_json: `${req.protocol}://${req.get('host')}/api-docs.json`
    },
    endpoints: {
      authentication: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login"
      },
      products: {
        list: "GET /api/products",
        create: "POST /api/products",
        // Añade aquí tus otros endpoints de productos
      },
      password_evaluation: {
        evaluate: "POST /api/v1/password/evaluate"
      }
    },
    features: [
      "✅ Cálculo de entropía de contraseñas",
      "✅ Detección de contraseñas comprometidas",
      "✅ Análisis de fuerza y seguridad",
      "✅ Estimación de tiempo de crackeo",
      "✅ Zero persistencia de contraseñas",
      "✅ Documentación interactiva con Swagger"
    ]
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: "Endpoint no encontrado",
    documentation: "/api-docs"
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || "Error interno del servidor"
  });
});

// Sincronizar base de datos e iniciar servidor
sequelize.sync({ force: false }).then(() => {
  console.log('\n🗄️  Base de datos sincronizada');
  
  app.listen(PORT, () => {
    console.log('\n🚀 ===================================');
    console.log(`   Servidor corriendo en puerto ${PORT}`);
    console.log('🚀 ===================================\n');
    console.log('📊 Endpoints disponibles:');
    console.log(`   → API: http://localhost:${PORT}`);
    console.log(`   → Docs: http://localhost:${PORT}/api-docs`);
    console.log(`   → OpenAPI JSON: http://localhost:${PORT}/api-docs.json\n`);
    console.log('🔐 Endpoints de autenticación:');
    console.log(`   → POST /api/auth/register`);
    console.log(`   → POST /api/auth/login\n`);
    console.log('📦 Endpoints de productos:');
    console.log(`   → GET /api/products`);
    console.log(`   → POST /api/products\n`);
    console.log('🔒 Endpoints de evaluación de contraseñas:');
    console.log(`   → POST /api/v1/password/evaluate\n`);
    console.log('📚 Visita /api-docs para documentación interactiva');
    console.log('=====================================\n');
  });
}).catch((error) => {
  console.error('❌ Error al sincronizar la base de datos:', error);
  process.exit(1);
});