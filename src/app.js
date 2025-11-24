/**
 * @file app.js
 * @description Configuración principal de la aplicación Express.
 * Se encarga de inicializar middlewares, cargar variables de entorno
 * y registrar todas las rutas de la API relacionadas con usuarios.
 */
import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./config/swagger.js";

import usuarioRoutes from './routes/usuario.routes.js';

dotenv.config(); // Cargamos las variables

const app = express();

console.log('DB URL:', process.env.DATABASE_URL); //ver que base de datos emplea

app.use(express.json()); //habilita que use json en las peticiones

app.use('/api/usuarios', usuarioRoutes);

app.use('/api/docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;