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

  /**
  * Realiza logout/revoca tokens del usuario autenticado.
  * @async
  * @function getLogout
  * @route GET /api/usuarios/logout
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @returns {Promise<boolean|ErrorResponseDTO>}
  * @response 200 - Logout realizado correctamente.
  * @response 400 - UID no proporcionado.
  * @response 401 - Token inválido (middleware previo).
  * @response 403 - Usuario no autorizado (middleware previo).
  * @response 500 - Error interno al revocar tokens.
  */
  async getLogout(req, res) {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(400).json(new ErrorResponseDTO({ code: 400, message: 'UID no proporcionado', path: req.originalUrl }));

      await UsuarioService.logout(String(uid));
      res.status(200).json(true);
    } catch (error) {
      console.error(error);
      res.status(500).json(new ErrorResponseDTO({
        code: 500,
        message: 'Error al eliminar el token.',
        path: req.originalUrl,
      }));
    }
  },
  
  /**
   * Crea un nuevo usuario (autenticado externamente). Regresa 201 y Location.
   * @async
   * @function createUsuario
   * @route POST /api/usuarios/
   * @returns {Promise<UsuarioDTO|ArtistaDTO|ErrorResponseDTO>}
   * @response 201 - Usuario creado correctamente. Location header con /api/usuarios/{id}.
   * @response 400 - Parámetros inválidos.
   * @response 401 - Token inválido (middleware previo).
   * @response 403 - Usuario no autorizado (middleware previo).
   * @response 409 - Conflicto (correo/nombre existente).
   * @response 500 - Error interno al crear usuario.
   */
  async createUsuario(req, res) {
    try {
      const data = await UsuarioService.createUsuario(req.body);

      res
        .status(201)
        .location(`/api/usuarios/${data.id}`)
        .json(data);
    } catch (error) {
      console.error(error);
      if (error instanceof ErrorResponseDTO) return res.status(error.code).json(error);

      const status = error.message?.includes('ya está') || error.message?.includes('ya existe') ? 409 : 500;
      res.status(status).json(new ErrorResponseDTO({
        code: status,
        message: error.message || 'Error al crear el usuario.',
        path: req.originalUrl,
      }));
    }
  },



};