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
 * @route GET /api/usuarios/logout
 * @description Realiza el cierre de sesión del usuario autenticado.
 * @access Privado (requiere JWT Firebase)
 * @returns {void|ErrorResponseDTO} Confirmación de cierre de sesión.
 */
router.get('/logout', verifyFirebaseToken, UsuarioController.getLogout);  //Endpoint privado

/**
 * @route DELETE /api/usuarios/:id
 * @description Elimina un usuario según su ID. El ID debe coincidir con el usuario del token.
 * @access Privado (requiere JWT Firebase)
 * @param {number} id - ID del usuario a eliminar.
 * @returns {void|ErrorResponseDTO} Sin contenido si la eliminación es correcta.
 */
router.delete('/:id', verifyFirebaseToken, UsuarioController.deleteUsuario);  //Endpoint privado

/**
 * @route GET /api/usuarios/:id
 * @description Obtiene la información pública de un usuario según su ID.
 * @access Público
 * @param {number} id - ID del usuario.
 * @returns {UsuarioPublicDTO|ErrorResponseDTO} Datos públicos del usuario.
 */
router.get('/:id', UsuarioController.getUsuarioPubliById); //Endpoint publico pruebas

/**
 * @route GET /api/usuarios/
 * @description Obtiene la lista de usuarios públicos almacenados.
 * @access Público
 * @returns {Array<UsuarioPublicDTO>|ErrorResponseDTO} Lista de usuarios.
 */
router.get('/', UsuarioController.getUsuariosPubli); //Endpoint publico pruebas

/**
 * @route POST /api/usuarios/
 * @description Crea un nuevo usuario autenticado externamente y lo registra en la base de datos.
 * @access Público
 * @body {UsuarioDTO} Datos del usuario a registrar.
 * @returns {UsuarioDTO|ArtistaDTO|ErrorResponseDTO} Usuario creado.
 */
router.post('/', UsuarioController.createUsuario);

/**
 * @route PUT /api/usuarios/
 * @description Modifica los datos del usuario autenticado. El usuario se identifica mediante JWT.
 * @access Privado (requiere JWT Firebase)
 * @body {UsuarioDTO} Datos actualizados.
 * @returns {UsuarioDTO|ArtistaDTO|ErrorResponseDTO} Usuario actualizado.
 */
router.put('/', verifyFirebaseToken, UsuarioController.updateUsuario);  //Endpoint privado

export default router;
