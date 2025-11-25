/**
 * @file favorito.controller.js
 * @description Controlador encargado de gestionar los elementos favoritos del usuario:
 * artistas, canciones y álbumes. Expone los endpoints definidos en las rutas y delega la
 * lógica de negocio al FavoritoService.
 */

import { FavoritoService } from '../services/favorito.service.js';
import { ErrorResponseDTO } from '../dto/errorResponse.dto.js';

export const FavoritoController = {

  /**
   * Agrega un nuevo elemento a la lista de favoritos del usuario.
   *
   * @async
   * @function createFavorito
   * @route POST /favoritos
   *
   * @description Registra un artista, álbum o canción como favorito.
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   *
   * @returns {Promise<UsuarioFavoritoElementoDTO|ErrorResponseDTO>}
   *
   * @response 201 - Favorito creado correctamente.
   * @response 400 - Parámetros inválidos.
   * @response 409 - El elemento ya era favorito.
   * @response 401 - Token inválido (middleware previo).
   * @response 403 - Usuario no autorizado (middleware previo).
   * @response 500 - Error interno al crear el favorito.
   */
  async createFavorito(req, res) {
    try {
      const data = await FavoritoService.createFavorito(req.body);

      res
        .status(201)
        .location(`/favoritos/${data.idUsuario}/${data.idElemento}/${data.tipo === 0 ? "artista" : "contenido"}`)
        .json(data);

    } catch (error) {
      console.error(error);

      if (error instanceof ErrorResponseDTO) {
        return res.status(error.code).json(error);
      }

      const status = error.message?.includes("ya está")
        ? 409
        : 500;

      res.status(status).json(
        new ErrorResponseDTO({
          code: status,
          message: error.message || "Error al registrar el favorito en la base de datos.",
          path: req.originalUrl,
        })
      );
    }
  },
};
