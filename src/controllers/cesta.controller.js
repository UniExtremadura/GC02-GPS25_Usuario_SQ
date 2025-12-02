/**
 * @file cesta.controller.js
 * @description Controlador para la gestión de la cesta de compra del usuario.
 * Expone los endpoints definidos en la capa de rutas y delega la lógica de negocio en CestaService.
 */

import { CestaService } from '../services/cesta.service.js';
import { ErrorResponseDTO } from '../dto/errorResponse.dto.js';

export const CestaController = {

  /**
   * Obtiene todos los elementos de la cesta del usuario.
   *
   * @async
   * @function getCestaByUser
   * @route GET /cesta/:idusuario
   * @description Devuelve la cesta completa del usuario, incluyendo los elementos y el total calculado.
   * Combina información de la base de datos con datos del servicio de Contenido.
   *
   * @param {import('express').Request} req - Petición HTTP.
   * @param {import('express').Response} res - Respuesta HTTP.
   *
   * @returns {Promise<CestaDTO|ErrorResponseDTO>}
   *
   * @response 200 - Cesta del usuario, incluso si está vacía.
   * @response 401 - Token inválido o no autorizado (middleware previo).
   * @response 403 - ID de parámetros no coincide con el usuario autenticado (middleware previo).
   * @response 500 - Error interno del servidor.
   */
  async getCestaByUser(req, res) {
    try {
      const idusuario = Number.parseInt(req.params.idusuario);
      const data = await CestaService.getCestaByUser(idusuario);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);

      if (error instanceof ErrorResponseDTO) {
        return res.status(error.code).json(error);
      }

      res.status(500).json(
        new ErrorResponseDTO({
          code: 500,
          message: `Error interno al obtener la cesta del usuario.`,
          path: req.originalUrl,
        })
      );
    }
  },

  /**
   * Crea una nueva relación usuario-elemento dentro de la cesta.
   *
   * @async
   * @function createItemCesta
   * @route POST /cesta
   * @description Añade un elemento a la cesta del usuario.  
   * Si ya existe → 409 conflicto.
   *
   * @param {import('express').Request} req - Cuerpo: { idusuario, idelemento, tipo }
   * @param {import('express').Response} res
   *
   * @returns {Promise<UsuarioCestaElementoDTO|ErrorResponseDTO>}
   *
   * @response 201 - Elemento añadido correctamente.
   * @response 400 - Datos incompletos o inválidos.
   * @response 401 - Token inválido (middleware previo).
   * @response 403 - ID no coincide con el usuario autenticado (middleware previo).
   * @response 409 - El elemento ya estaba en la cesta.
   * @response 500 - Error interno del servidor.
   */
  async createItemCesta(req, res) {
    try {
      const { idusuario, idelemento } = req.body;

      // Validación previa (Swagger indica error 400)
      if (!idusuario || !idelemento) {
        return res.status(400).json(
          new ErrorResponseDTO({
            code: 400,
            message: "Solicitud inválida o faltan campos requeridos.",
            path: req.originalUrl,
          })
        );
      }

      const data = await CestaService.createItemCesta(req.body);

      res.status(201)
        .location(`/api/usuarios/cesta/${idusuario}/${idelemento}`)
        .json(data);

    } catch (error) {
      console.error(error);

      if (error instanceof ErrorResponseDTO) {
        return res.status(error.code).json(error);
      }

      if (error.message?.includes("ya está en la cesta")) {
        return res.status(409).json(
          new ErrorResponseDTO({
            code: 409,
            message: "El elemento ya está presente en la cesta del usuario.",
            path: req.originalUrl,
          })
        );
      }

      res.status(500).json(
        new ErrorResponseDTO({
          code: 500,
          message: `Error interno al crear el elemento de la cesta.`,
          path: req.originalUrl,
        })
      );
    }
  },

  /**
   * Verifica si un elemento está en la cesta del usuario.
   *
   * @async
   * @function existItemCesta
   * @route GET /cesta/:idusuario/:idelemento
   * @description Comprueba si un usuario ha añadido un elemento a su cesta.
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   *
   * @returns {Promise<boolean|ErrorResponseDTO>}
   *
   * @response 200 - Devuelve `{ isInCesta: boolean }`.
   * @response 401 - Token inválido (middleware previo).
   * @response 403 - ID no coincide con el usuario autenticado (middleware previo).
   * @response 500 - Error interno del servidor.
   */
  async existItemCesta(req, res) {
    try {
      const idusuario = Number.parseInt(req.params.idusuario);
      const idelemento = Number.parseInt(req.params.idelemento);

      const isInCesta = await CestaService.existItemCesta(idusuario, idelemento);

      res.status(200).json( isInCesta );

    } catch (error) {
      console.error(error);

      if (error instanceof ErrorResponseDTO) {
        return res.status(error.code).json(error);
      }

      res.status(500).json(
        new ErrorResponseDTO({
          code: 500,
          message: `Error interno al verificar el estado del elemento en la cesta.`,
          path: req.originalUrl,
        })
      );
    }
  },

  /**
   * Elimina un elemento de la cesta del usuario.
   *
   * @async
   * @function deleteItemCesta
   * @route DELETE /cesta/:idusuario/:idelemento
   * @description Elimina la relación si existe.  
   * Si elimina correctamente → 204 sin contenido.
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   *
   * @returns {Promise<void|ErrorResponseDTO>}
   *
   * @response 204 - Eliminado correctamente.
   * @response 401 - Token inválido (middleware previo).
   * @response 403 - ID no coincide con el usuario autenticado (middleware previo).
   * @response 404 - El elemento no existe en la cesta.
   * @response 500 - Error interno del servidor.
   */
  async deleteItemCesta(req, res) {
    try {
      const idusuario = Number.parseInt(req.params.idusuario);
      const idelemento = Number.parseInt(req.params.idelemento);

      const eliminado = await CestaService.deleteItemCesta(idusuario, idelemento);

      if (!eliminado) {
        return res.status(404).json(
          new ErrorResponseDTO({
            code: 404,
            message: `Elemento o usuario no encontrado en la cesta.`,
            path: req.originalUrl,
          })
        );
      }

      res.status(204).end();

    } catch (error) {
      console.error(error);

      if (error instanceof ErrorResponseDTO) {
        return res.status(error.code).json(error);
      }

      res.status(500).json(
        new ErrorResponseDTO({
          code: 500,
          message: `Error interno al eliminar el elemento de la cesta.`,
          path: req.originalUrl,
        })
      );
    }
  },

};
