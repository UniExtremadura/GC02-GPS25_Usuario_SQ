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
   * Obtiene todos los elementos favoritos de un usuario.
   *
   * @async
   * @function getFavoritosByUser
   * @route GET /favoritos/:idUsuario
   *
   * @description Recupera artistas, canciones y álbumes marcados como favoritos por el usuario.
   * Se relaciona con el componente de Contenidos y Artistas para completar la información.
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   *
   * @returns {Promise<Array<ElementoDTO|ArtistaDTO>|ErrorResponseDTO>}
   *
   * @response 200 - Lista de favoritos obtenida correctamente.
   * @response 401 - Token inválido (middleware previo).
   * @response 403 - Usuario no autorizado (middleware previo).
   * @response 500 - Error interno al obtener los elementos favoritos.
   */
  async getFavoritosByUser(req, res) {
    try {
      const idusuario = parseInt(req.params.idusuario);
      const data = await FavoritoService.getFavoritosByUser(idusuario);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);

      if (error instanceof ErrorResponseDTO) {
        return res.status(error.code).json(error);
      }

      res.status(500).json(
        new ErrorResponseDTO({
          code: 500,
          message: `Error al obtener los elementos favoritos del usuario.`,
          path: req.originalUrl,
        })
      );
    }
  },

  /**
   * Verifica si un artista es favorito del usuario.
   *
   * @async
   * @function existArt
   * @route GET /favoritos/:idUsuario/:idArtista/artista
   *
   * @description Devuelve true/false dependiendo de si el artista está marcado como favorito.
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   *
   * @returns {Promise<boolean|ErrorResponseDTO>}
   *
   * @response 200 - Resultado de la verificación.
   * @response 401 - Token inválido (middleware previo).
   * @response 403 - Usuario no autorizado (middleware previo).
   * @response 500 - Error interno al verificar el favorito.
   */
  async existArt(req, res) {
    try {
      const idusuario = parseInt(req.params.idusuario);
      const idelemento = parseInt(req.params.idelemento);
      const data = await FavoritoService.existArt(idusuario, idelemento);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);

      res.status(500).json(
        new ErrorResponseDTO({
          code: 500,
          message: `Error al verificar si el artista es favorito.`,
          path: req.originalUrl,
        })
      );
    }
  },

  /**
   * Elimina un artista de la lista de favoritos del usuario.
   *
   * @async
   * @function deleteArt
   * @route DELETE /favoritos/:idUsuario/:idArtista/artista
   *
   * @description Elimina la relación usuario–artista en favoritos.
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   *
   * @returns {Promise<void|ErrorResponseDTO>}
   *
   * @response 204 - Artista eliminado correctamente.
   * @response 404 - El artista no estaba en los favoritos del usuario.
   * @response 401 - Token inválido (middleware previo).
   * @response 403 - Usuario no autorizado (middleware previo).
   * @response 500 - Error interno al eliminar el artista.
   */
  async deleteArt(req, res) {
    try {
      const idusuario = parseInt(req.params.idusuario);
      const idelemento = parseInt(req.params.idelemento);

      const data = await FavoritoService.deleteArt(idusuario, idelemento);
      if (!data) {
        return res.status(404).json(
          new ErrorResponseDTO({
            code: 404,
            message: "El artista no estaba en los favoritos del usuario.",
            path: req.originalUrl,
          })
        );
      }

      res.status(204).end();
    } catch (error) {
      console.error(error);

      res.status(500).json(
        new ErrorResponseDTO({
          code: 500,
          message: `Error al eliminar el artista de favoritos.`,
          path: req.originalUrl,
        })
      );
    }
  },

  /**
   * Verifica si un contenido (álbum o canción) es favorito del usuario.
   *
   * @async
   * @function existCont
   * @route GET /favoritos/:idUsuario/:idContenido/contenido
   *
   * @description Comprueba si la relación usuario–contenido existe.
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
  async existCont(req, res) {
    try {
      const idusuario = parseInt(req.params.idusuario);
      const idelemento = parseInt(req.params.idelemento);

      const data = await FavoritoService.existCont(idusuario, idelemento);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);

      res.status(500).json(
        new ErrorResponseDTO({
          code: 500,
          message: `Error al verificar si el contenido es favorito.`,
          path: req.originalUrl,
        })
      );
    }
  },

  /**
   * Elimina un contenido (álbum o canción) de la lista de favoritos.
   *
   * @async
   * @function deleteCont
   * @route DELETE /favoritos/:idUsuario/:idContenido/contenido
   *
   * @description Elimina la relación usuario–contenido en favoritos.
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   *
   * @returns {Promise<void|ErrorResponseDTO>}
   *
   * @response 204 - Contenido eliminado correctamente.
   * @response 404 - El contenido no estaba en favoritos.
   * @response 401 - Token inválido (middleware previo).
   * @response 403 - Usuario no autorizado (middleware previo).
   * @response 500 - Error interno al eliminar el contenido.
   */
  async deleteCont(req, res) {
    try {
      const idusuario = parseInt(req.params.idusuario);
      const idelemento = parseInt(req.params.idelemento);

      const data = await FavoritoService.deleteCont(idusuario, idelemento);
      if (!data) {
        return res.status(404).json(
          new ErrorResponseDTO({
            code: 404,
            message: "El contenido no estaba en los favoritos del usuario.",
            path: req.originalUrl,
          })
        );
      }

      res.status(204).end();
    } catch (error) {
      console.error(error);

      res.status(500).json(
        new ErrorResponseDTO({
          code: 500,
          message: `Error al eliminar el contenido de favoritos.`,
          path: req.originalUrl,
        })
      );
    }
  },

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
