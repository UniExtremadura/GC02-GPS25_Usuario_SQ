/**
 * @file favorito.service.js
 * @description Lógica de negocio relacionada con los elementos favoritos del usuario.
 * Soporta artistas, canciones y álbumes.
 */

import { FavoritoDAO } from '../dao/favorito.dao.js';
import { UsuarioFavoritoElementoDTO } from '../dto/relacion.dto.js';
import { ErrorResponseDTO } from '../dto/errorResponse.dto.js';

export const FavoritoService = {
  /**
   * Agrega un elemento a la lista de favoritos.
   *
   * @async
   * @function createFavorito
   * @param {UsuarioFavoritoElementoDTO} data
   * @returns {Promise<UsuarioFavoritoElementoDTO>}
   *
   * @description Valida si el elemento ya existe como favorito.
   *
   * @throws {ErrorResponseDTO}
   */
  async createFavorito(data) {
    try {
      const tipo = [data.tipo];

      const existe = await FavoritoDAO.findOne(data.idusuario, data.idelemento, tipo);
      if (existe) {
        throw new ErrorResponseDTO({
          code: 409,
          message: "El elemento ya se encuentra en la lista de favoritos del usuario.",
          path: `/favoritos`,
        });
      }

      const creado = await FavoritoDAO.create(data);
      return new UsuarioFavoritoElementoDTO(creado);
    } catch (error) {
      if (error instanceof ErrorResponseDTO) throw error;

      throw new ErrorResponseDTO({
        code: 500,
        message: "Error al registrar el favorito en la base de datos.",
        path: `/favoritos`,
      });
    }
  },
};
