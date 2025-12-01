/**
 * @file app.js
 * @description Configuración principal de la aplicación Express.
 * Se encarga de inicializar middlewares, cargar variables de entorno
 * y registrar todas las rutas de la API relacionadas con usuarios.
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./config/swagger.js";


import usuarioRoutes from './routes/usuario.routes.js';
import artistaRoutes from './routes/artista.routes.js';
import favoritoRoutes from './routes/favorito.routes.js';
import cestaRoutes from './routes/cesta.routes.js';
import deseaRoutes from './routes/desea.routes.js';
import compradoRoutes from './routes/comprado.routes.js';

dotenv.config(); // Cargamos las variables

const app = express();

const allowedOrigins = [
  process.env.PORT_CORS || "http://localhost:3333",
  "http://127.0.0.1:3333"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


console.log('DB URL:', process.env.DATABASE_URL); //ver que base de datos emplea

app.use(express.json()); //habilita que use json en las peticiones

app.use('/api/usuarios/artistas', artistaRoutes);
app.use('/api/usuarios/favoritos', favoritoRoutes);
app.use('/api/usuarios/cesta', cestaRoutes);
app.use('/api/usuarios/desea', deseaRoutes);
app.use('/api/usuarios/tiene', compradoRoutes);

app.use('/api/usuarios', usuarioRoutes);

app.use('/api/docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;