/**
 * @file usuario.routes.js
 * @description Define las rutas relacionadas con la gestión de usuarios.
 * Algunas rutas requieren autenticación mediante Firebase JWT.
 * 
*/
import { Router } from 'express';
import { verifyFirebaseToken } from "../middlewares/authJWTFirebase.js";
import { UsuarioController } from '../controllers/usuario.controller.js';

const router = Router();

/**
 * @route GET /api/usuarios/login
 * @description Obtiene los datos del usuario autenticado según el token JWT.
 * Este endpoint valida el token enviado en la cabecera Authorization.
 * @access Privado (requiere JWT Firebase)
 * @returns {UsuarioDTO|ArtistaDTO|ErrorResponseDTO} Datos del usuario autenticado.
 */
router.get('/login', verifyFirebaseToken, UsuarioController.getLogin);  //Endpoint privado

/**
 * @route POST /api/usuarios/
 * @description Crea un nuevo usuario autenticado externamente y lo registra en la base de datos.
 * @access Público
 * @body {UsuarioDTO} Datos del usuario a registrar.
 * @returns {UsuarioDTO|ArtistaDTO|ErrorResponseDTO} Usuario creado.
 */
router.post('/', UsuarioController.createUsuario);

export default router;
