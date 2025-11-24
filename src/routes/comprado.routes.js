/**
 * @file comprado.routes.js
 * @description Define las rutas relacionadas con los elementos comprados por el usuario.
 * Todas las rutas requieren autenticación mediante Firebase JWT.
 */

import { Router } from 'express';
import { verifyFirebaseToken } from "../middlewares/authJWTFirebase.js";
import { CompradoController } from '../controllers/comprado.controller.js';

const router = Router();

/**
 * @route POST /api/usuarios/tiene/:idusuario
 * @description Registra una compra trasladando los elementos de la cesta a la lista de compras.
 * @access Privado (requiere JWT Firebase)
 * @param {string} idusuario - ID del usuario.
 * @returns {void|ErrorResponseDTO} Si el correcto, responde con 201 y Location del recurso.
 */
router.post('/:idusuario', verifyFirebaseToken, CompradoController.createComprados);  // Endpoint privado

export default router;
