/**
 * @file cesta.controller.js
 * @description Controlador para la gestión de la cesta de compra del usuario.
 * Expone los endpoints definidos en la capa de rutas y delega la lógica de negocio en CestaService.
 */

import { CestaService } from '../services/cesta.service.js';
import { ErrorResponseDTO } from '../dto/errorResponse.dto.js';

export const CestaController = {
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

};
