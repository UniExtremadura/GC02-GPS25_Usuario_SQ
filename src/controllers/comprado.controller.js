/**
 * @file comprado.controller.js
 * @description Controlador para la gestión de elementos comprados por el usuario.
 * Expone los endpoints definidos en las rutas y delega la lógica de negocio al CompradoService.
 */

import { CompradoService } from '../services/comprado.service.js';
import { ErrorResponseDTO } from '../dto/errorResponse.dto.js';

export const CompradoController = {
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
      const idusuario = parseInt(req.params.idusuario);
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
};
