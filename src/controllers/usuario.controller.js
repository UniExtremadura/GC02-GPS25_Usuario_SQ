/**
 * @file usuario.controller.js
 * @description Controlador encargado de gestionar las peticiones HTTP relacionadas
 * con usuarios. Valida y transforma parámetros mínimos y delega la lógica al
 * UsuarioService. Los errores 401/403 se manejan por middleware externo (authJWTFirebase).
 */

import { UsuarioService } from '../services/usuario.service.js';
import { ErrorResponseDTO } from '../dto/errorResponse.dto.js';

export const UsuarioController = {
  /**
  * Obtiene el usuario autenticado según el token (ruta /login). El middleware
  * verifyFirebaseToken ya valida 401/403.
  * @async
  * @function getLogin
  * @route GET /api/usuarios/login
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @returns {Promise<UsuarioDTO|ArtistaDTO|ErrorResponseDTO>}
  * @response 200 - Usuario autenticado obtenido correctamente.
  * @response 400 - UID de token inválido.
  * @response 401 - Token inválido (middleware previo).
  * @response 403 - Usuario no autorizado (middleware previo).
  * @response 404 - Usuario no encontrado.
  * @response 500 - Error interno al obtener el usuario autenticado.
  */
  async getLogin(req, res) {
    try {
      const uid = parseInt(req.user?.uid);
      if (Number.isNaN(uid)) {
        return res.status(400).json(new ErrorResponseDTO({
          code: 400,
          message: 'UID de token inválido.',
          path: req.originalUrl,
        }));
      }

      const data = await UsuarioService.obtenerUsuario(uid);
      if (!data) {
        return res.status(404).json(new ErrorResponseDTO({
          code: 404,
          message: 'Usuario no encontrado.',
          path: req.originalUrl,
        }));
      }

      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json(new ErrorResponseDTO({
        code: 500,
        message: 'Error al obtener el usuario autenticado.',
        path: req.originalUrl,
      }));
    }
  },


};