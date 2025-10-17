import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Seguridad de la Información - Evaluación de Contraseñas',
      version: '1.0.0',
      description: `
API RESTful para evaluar la fuerza de contraseñas mediante el cálculo de entropía.

## Conceptos Clave

### Entropía de Contraseñas
La entropía (E) es una medida de la imprevisibilidad de una contraseña, expresada en bits.
Cuanto mayor es la entropía, más segura es la contraseña.

### Fórmula
\`\`\`
E = L × log₂(N)
\`\`\`

Donde:
- **L**: Longitud de la contraseña (número de caracteres)
- **N**: Tamaño del alfabeto (keyspace)
  - Solo números (0-9): 10
  - Minúsculas (a-z): 26
  - Mayúsculas (A-Z): 26
  - Símbolos especiales: 32
  - Combinados: suma de los tipos usados

### Clasificación de Fuerza

| Entropía (bits) | Clasificación | Tiempo de Crackeo Estimado |
|-----------------|---------------|---------------------------|
| 0 - 40          | Muy Débil     | Segundos a minutos        |
| 40 - 60         | Débil         | Horas a días              |
| 60 - 80         | Fuerte        | Meses a años              |
| 80 - 100        | Muy Fuerte    | Miles de años             |
| 100+            | Excelente     | Millones de años          |

### Seguridad y Privacidad
- ✅ **Zero Persistencia**: Las contraseñas nunca se almacenan
- ✅ **Sin Logging**: No se registran las contraseñas en logs
- ✅ **Validación**: Se validan todas las entradas
- ✅ **Diccionario**: Se detectan contraseñas comprometidas
      `,
      contact: {
        name: 'Equipo de Desarrollo',
        email: 'soporte@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://api.example.com',
        description: 'Servidor de producción'
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'Endpoints de autenticación y registro de usuarios'
      },
      {
        name: 'Password Evaluation',
        description: 'Endpoints para evaluación de seguridad de contraseñas'
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'Juan Pérez'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'M!Contr@s3ñ4_S3gur@'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'juan@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'M!Contr@s3ñ4_S3gur@'
            }
          }
        },
        PasswordEvaluationRequest: {
          type: 'object',
          required: ['password'],
          properties: {
            password: {
              type: 'string',
              description: 'Contraseña a evaluar (no se almacena)',
              example: 'M!Contr@s3ñ4_2025',
              minLength: 1,
              maxLength: 128
            }
          }
        },
        PasswordEvaluationResponse: {
          type: 'object',
          properties: {
            evaluation: {
              type: 'object',
              properties: {
                strength: {
                  type: 'string',
                  enum: ['Muy Débil', 'Muy Débil (Común)', 'Débil', 'Débil (Variante Común)', 'Fuerte', 'Muy Fuerte', 'Excelente'],
                  example: 'Muy Fuerte'
                },
                score: {
                  type: 'integer',
                  minimum: 1,
                  maximum: 5,
                  example: 4,
                  description: 'Puntuación de 1 (muy débil) a 5 (excelente)'
                },
                entropy: {
                  type: 'number',
                  format: 'float',
                  example: 95.27,
                  description: 'Entropía calculada en bits'
                },
                crackTime: {
                  type: 'string',
                  example: '3.15e+15 años',
                  description: 'Tiempo estimado para crackear (10^11 intentos/seg)'
                }
              }
            },
            details: {
              type: 'object',
              properties: {
                length: {
                  type: 'integer',
                  example: 15,
                  description: 'Longitud de la contraseña (L)'
                },
                keyspace: {
                  type: 'integer',
                  example: 94,
                  description: 'Tamaño del alfabeto (N)'
                },
                characterTypes: {
                  type: 'array',
                  items: {
                    type: 'string',
                    enum: ['minúsculas', 'mayúsculas', 'números', 'símbolos']
                  },
                  example: ['minúsculas', 'mayúsculas', 'números', 'símbolos']
                },
                formula: {
                  type: 'string',
                  example: 'E = 15 × log₂(94) = 95.27 bits',
                  description: 'Fórmula aplicada con valores específicos'
                }
              }
            },
            warnings: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: [
                'La contraseña cumple con los estándares básicos'
              ]
            },
            recommendations: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: [
                'Usa al menos 12 caracteres',
                'Combina mayúsculas, minúsculas, números y símbolos',
                'Evita palabras del diccionario y datos personales',
                'No reutilices contraseñas entre diferentes servicios',
                'Considera usar un gestor de contraseñas'
              ]
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'El campo password es obligatorio'
            }
          }
        },
        SuccessMessage: {
          type: 'object',
          properties: {
            msg: {
              type: 'string'
            }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenido del endpoint /api/auth/login'
        }
      }
    }
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Docs - Evaluación de Contraseñas',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      tryItOutEnabled: true
    }
  }));
  
  // Endpoint para obtener el JSON de Swagger
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log('📚 Documentación Swagger disponible en: http://localhost:3000/api-docs');
};

export default swaggerSpec;