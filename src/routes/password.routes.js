import express from "express";
import { evaluatePassword } from "../controllers/password.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/password/evaluate:
 *   post:
 *     summary: Evalúa la fuerza de una contraseña
 *     description: |
 *       Calcula la entropía de una contraseña usando la fórmula E = L × log₂(N) y proporciona
 *       una evaluación completa de su seguridad.
 *       
 *       ## Características
 *       - ✅ Cálculo preciso de entropía
 *       - ✅ Detección de contraseñas comprometidas (diccionario)
 *       - ✅ Análisis de tipos de caracteres
 *       - ✅ Estimación de tiempo de crackeo
 *       - ✅ Zero persistencia (no se almacena la contraseña)
 *       
 *       ## Parámetros de la Fórmula
 *       - **L**: Longitud de la contraseña
 *       - **N**: Keyspace (suma de tipos de caracteres)
 *         - Minúsculas: +26
 *         - Mayúsculas: +26
 *         - Números: +10
 *         - Símbolos: +32
 *       
 *       ## Clasificación
 *       - **0-40 bits**: Muy Débil
 *       - **40-60 bits**: Débil
 *       - **60-80 bits**: Fuerte
 *       - **80-100 bits**: Muy Fuerte
 *       - **100+ bits**: Excelente
 *     tags:
 *       - Password Evaluation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordEvaluationRequest'
 *           examples:
 *             debil:
 *               summary: Contraseña Débil
 *               value:
 *                 password: "123456"
 *             media:
 *               summary: Contraseña Media
 *               value:
 *                 password: "Password123"
 *             fuerte:
 *               summary: Contraseña Fuerte
 *               value:
 *                 password: "M!Contr@s3ñ4_2025"
 *             excelente:
 *               summary: Contraseña Excelente
 *               value:
 *                 password: "X9#kL$mP2@qR5^wT8&yU3!aB7*cD4"
 *     responses:
 *       200:
 *         description: Evaluación exitosa de la contraseña
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PasswordEvaluationResponse'
 *             examples:
 *               debil:
 *                 summary: Evaluación de contraseña débil
 *                 value:
 *                   evaluation:
 *                     strength: "Muy Débil (Común)"
 *                     score: 1
 *                     entropy: 19.93
 *                     crackTime: "0.00 segundos"
 *                   details:
 *                     length: 6
 *                     keyspace: 10
 *                     characterTypes: ["números"]
 *                     formula: "E = 6 × log₂(10) = 19.93 bits"
 *                   warnings:
 *                     - "Esta contraseña está en listas de contraseñas comprometidas"
 *                     - "CRÍTICO: No uses esta contraseña bajo ninguna circunstancia"
 *                     - "La contraseña debería tener al menos 8 caracteres"
 *                   recommendations:
 *                     - "Usa al menos 12 caracteres"
 *                     - "Combina mayúsculas, minúsculas, números y símbolos"
 *               fuerte:
 *                 summary: Evaluación de contraseña fuerte
 *                 value:
 *                   evaluation:
 *                     strength: "Muy Fuerte"
 *                     score: 4
 *                     entropy: 95.27
 *                     crackTime: "3.15e+15 años"
 *                   details:
 *                     length: 15
 *                     keyspace: 94
 *                     characterTypes: ["minúsculas", "mayúsculas", "números", "símbolos"]
 *                     formula: "E = 15 × log₂(94) = 95.27 bits"
 *                   warnings:
 *                     - "La contraseña cumple con los estándares básicos"
 *                   recommendations:
 *                     - "Usa al menos 12 caracteres"
 *                     - "Combina mayúsculas, minúsculas, números y símbolos"
 *       400:
 *         description: Petición inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               campoFaltante:
 *                 summary: Campo password faltante
 *                 value:
 *                   error: "El campo password es obligatorio"
 *               tipoInvalido:
 *                 summary: Tipo de dato inválido
 *                 value:
 *                   error: "El campo password debe ser una cadena de texto"
 *               vacio:
 *                 summary: Contraseña vacía
 *                 value:
 *                   error: "La contraseña no puede estar vacía"
 *               muyLarga:
 *                 summary: Contraseña demasiado larga
 *                 value:
 *                   error: "La contraseña es demasiado larga (máximo 128 caracteres)"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Error al evaluar la contraseña"
 */
router.post("/evaluate", evaluatePassword);

export default router;