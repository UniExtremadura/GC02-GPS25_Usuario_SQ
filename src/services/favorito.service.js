/**
 * @file favorito.service.js
 * @description Lógica de negocio relacionada con los elementos favoritos del usuario.
 * Soporta artistas, canciones y álbumes.
 */

import { FavoritoDAO } from '../dao/favorito.dao.js';
import { ArtistaDAO } from '../dao/artista.dao.js';
import { UsuarioFavoritoElementoDTO } from '../dto/relacion.dto.js';
import { ElementoDTO } from '../dto/elemento.dto.js';
import { ArtistaDTO } from '../dto/artista.dto.js';
import { ErrorResponseDTO } from '../dto/errorResponse.dto.js';

export const FavoritoService = {

  /**
   * Obtiene todos los elementos favoritos de un usuario.
   *
   * @async
   * @function getFavoritosByUser
   * @param {number} idusuario - ID del usuario.
   * @returns {Promise<Array<ArtistaDTO|ElementoDTO>>}
   *
   * @description
   * Recupera todas las relaciones de favoritos y obtiene los datos completos de artistas,
   * canciones y álbumes consultando los microservicios correspondientes.
   *
   * @throws {ErrorResponseDTO}
   */
  async getFavoritosByUser(idusuario) {
    try {
      const relaciones = await FavoritoDAO.findAllByUsuario(idusuario);
      if (!relaciones.length) return [];

      const elementos = await Promise.all(
        relaciones.map(async (rel) => {
          if (rel.tipo === 0) {
            // Artista
            const usuario = await ArtistaDAO.findById(rel.idelemento);
            if (!usuario) throw new Error(`Error al obtener al artista favorito ${rel.idelemento}`);

            const generoId = usuario.artista?.idgenero ?? null;

            if (!generoId) {
              return new ArtistaDTO({ ...usuario, genero: null });
            }

            const url = `${process.env.API_CONTENIDO}/generos/${generoId}`;
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`Error al obtener el género ${generoId}`);
            }

            const genero = await response.json();
            return new ArtistaDTO({ ...usuario, genero });
          }

          // Elemento (álbum o canción)
          const url = `${process.env.API_CONTENIDO}/elementos/${rel.idelemento}`;
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Error al obtener elemento ${rel.idelemento}`);
          }

          const data = await response.json();
          return new ElementoDTO(data);
        })
      );

      return elementos;
    } catch (error) {
      throw new ErrorResponseDTO({
        code: 500,
        message: "Error al obtener los elementos favoritos del usuario.",
        path: `/favoritos/${idusuario}`,
      });
    }
  },

  /**
   * Verifica si un artista ya está marcado como favorito.
   *
   * @async
   * @function existArt
   * @param {number} idusuario
   * @param {number} idelemento
   * @returns {Promise<boolean>}
   *
   * @throws {ErrorResponseDTO}
   */
  async existArt(idusuario, idelemento) {
    try {
      const tipo = [0];
      const existe = await FavoritoDAO.findOne(idusuario, idelemento, tipo);
      return !!existe;
    } catch (error) {
      throw new ErrorResponseDTO({
        code: 500,
        message: "Error al verificar si el artista es favorito.",
        path: `/favoritos/${idusuario}/${idelemento}/artista`,
      });
    }
  },

  /**
   * Elimina un artista de favoritos.
   *
   * @async
   * @function deleteArt
   * @param {number} idusuario
   * @param {number} idelemento
   * @returns {Promise<UsuarioFavoritoElementoDTO|null>}
   *
   * @throws {ErrorResponseDTO}
   */
  async deleteArt(idusuario, idelemento) {
    try {
      const tipo = [0];
      const existe = await FavoritoDAO.findOne(idusuario, idelemento, tipo);
      if (!existe) return null;

      const eliminado = await FavoritoDAO.delete(idusuario, idelemento, tipo);
      return new UsuarioFavoritoElementoDTO(eliminado);
    } catch (error) {
      throw new ErrorResponseDTO({
        code: 500,
        message: "Error al eliminar el artista de favoritos.",
        path: `/favoritos/${idusuario}/${idelemento}/artista`,
      });
    }
  },

  /**
   * Verifica si un contenido (álbum o canción) es favorito del usuario.
   *
   * @async
   * @function existCont
   * @param {number} idusuario
   * @param {number} idelemento
   * @returns {Promise<boolean>}
   *
   * @throws {ErrorResponseDTO}
   */
  async existCont(idusuario, idelemento) {
    try {
      const tipo = [1, 2];
      const existe = await FavoritoDAO.findOne(idusuario, idelemento, tipo);
      return !!existe;
    } catch (_) {
      throw new ErrorResponseDTO({
        code: 500,
        message: "Error al verificar si el contenido es favorito.",
        path: `/favoritos/${idusuario}/${idelemento}/contenido`,
      });
    }
  },

  /**
   * Elimina un contenido (álbum o canción) de favoritos.
   *
   * @async
   * @function deleteCont
   * @param {number} idusuario
   * @param {number} idelemento
   * @returns {Promise<UsuarioFavoritoElementoDTO|null>}
   *
   * @throws {ErrorResponseDTO}
   */
  async deleteCont(idusuario, idelemento) {
    try {
      const tipo = [1, 2];
      const existe = await FavoritoDAO.findOne(idusuario, idelemento, tipo);
      if (!existe) return null;

      const eliminado = await FavoritoDAO.delete(idusuario, idelemento, tipo);
      return new UsuarioFavoritoElementoDTO(eliminado);
    } catch (error) {
      throw new ErrorResponseDTO({
        code: 500,
        message: "Error al eliminar el contenido de favoritos.",
        path: `/favoritos/${idusuario}/${idelemento}/contenido`,
      });
    }
  },

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
