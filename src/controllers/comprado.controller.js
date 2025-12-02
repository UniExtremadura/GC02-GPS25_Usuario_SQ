/**
 * @file comprado.controller.js
 * @description Controlador para la gestión de elementos comprados por el usuario.
 * Expone los endpoints definidos en las rutas y delega la lógica de negocio al CompradoService.
 */

import { CompradoService } from '../services/comprado.service.js';
import { ErrorResponseDTO } from '../dto/errorResponse.dto.js';

export const CompradoController = {
  /**
   * Obtiene todos los elementos comprados por un usuario.
   *
   * @async
   * @function getCompradosByIdUsuario
   * @route GET /tiene/:idUsuario
   *
   * @description Devuelve una lista de elementos comprados por un usuario.
   * Se apoya en el servicio de Contenidos para completar la información de cada elemento.
   *
   * @param {import('express').Request} req - Petición HTTP.
   * @param {import('express').Response} res - Respuesta HTTP.
   *
   * @returns {Promise<Array<ElementoDTO>|ErrorResponseDTO>}
   *
   * @response 200 - Lista de elementos comprados.
   * @response 401 - Token inválido (middleware previo).
   * @response 403 - Usuario no autorizado (middleware previo).
   * @response 500 - Error interno al obtener los elementos.
   */
  async getCompradosByIdUsuario(req, res) {
    try {
      const idusuario = Number.parseInt(req.params.idusuario);
      const data = await CompradoService.getCompradosByIdUsuario(idusuario);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);

      if (error instanceof ErrorResponseDTO) {
        return res.status(error.code).json(error);
      }

      res.status(500).json(
        new ErrorResponseDTO({
          code: 500,
          message: "Error interno al obtener los elementos comprados.",
          path: req.originalUrl,
        })
      );
    }
  },

  /**
   * Registra la compra de todos los elementos de la cesta del usuario.
   *
   * @async
   * @function createComprados
   * @route POST /tiene/:idUsuario
   *
   * @description Transfiere los elementos de la cesta a la lista de compras.
   * Responde 201 si la operación tiene éxito.
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   *
   * @returns {Promise<boolean|ErrorResponseDTO>}
   *
   * @response 201 - Compra registrada correctamente.
   * @response 400 - No hay elementos en la cesta.
   * @response 401 - Token inválido (middleware previo).
   * @response 403 - Usuario no autorizado (middleware previo).
   * @response 500 - Error interno al procesar la compra.
   */
  async createComprados(req, res) {
    try {
      const idusuario = Number.parseInt(req.params.idusuario);
      const data = await CompradoService.createComprados(idusuario);

      if (!data) {
        return res.status(400).json(
          new ErrorResponseDTO({
            code: 400,
            message: "No hay elementos en la cesta para procesar.",
            path: req.originalUrl,
          })
        );
      }

      res
        .status(201)
        .location(`/tiene/${idusuario}`)
        .json(data);
    } catch (error) {
      console.error(error);

      if (error instanceof ErrorResponseDTO) {
        return res.status(error.code).json(error);
      }

      res.status(500).json(
        new ErrorResponseDTO({
          code: 500,
          message: "Error interno al registrar la compra.",
          path: req.originalUrl,
        })
      );
    }
  },

  /**
   * Verifica si un usuario ha comprado un elemento específico.
   *
   * @async
   * @function exitComprado
   * @route GET /tiene/:idUsuario/:idElemento
   *
   * @description Devuelve `true` o `false` dependiendo de si el usuario compró el elemento.
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   *
   * @returns {Promise<boolean|ErrorResponseDTO>}
   *
   * @response 200 - Resultado de la verificación.
   * @response 401 - Token inválido (middleware previo).
   * @response 403 - Usuario no autorizado (middleware previo).
   * @response 500 - Error interno del servidor.
   */
  async exitComprado(req, res) {
    try {
      const idusuario = Number.parseInt(req.params.idusuario);
      const idelemento = Number.parseInt(req.params.idelemento);

      const data = await CompradoService.existComprado(idusuario, idelemento);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);

      if (error instanceof ErrorResponseDTO) {
        return res.status(error.code).json(error);
      }

      res.status(500).json(
        new ErrorResponseDTO({
          code: 500,
          message: "Error interno al verificar si el elemento fue comprado.",
          path: req.originalUrl,
        })
      );
    }
  },
};
