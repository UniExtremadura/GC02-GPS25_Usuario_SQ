/**
 * @file artista.service.js
 * @description Lógica de negocio relacionada con artistas.
 */
import { DeseaDAO } from '../dao/desea.dao.js';
import { UsuarioDeseaElementoDTO } from '../dto/relacion.dto.js';
import { ElementoDTO } from '../dto/elemento.dto.js';
import { ErrorResponseDTO } from '../dto/errorResponse.dto.js';


export const DeseaService = {

  /**
   * Obtiene la lista de deseos de un usuario.
   * @param {number} idusuario
   * @returns {Promise<Array<ElementoDTO>>}
   */
  async getDeseadosByUser(idusuario) {
    try {
      const relaciones = await DeseaDAO.findAllByUsuario(idusuario);    // Si no hay elementos, devolvemos array vacío
      if (!relaciones.length) return [];

      // Llamadas paralelas a la API externa
      const elementos = await Promise.all(
        relaciones.map(async (rel) => {
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
        message: "Error interno al obtener la lista de elementos deseados.",
        path: `/desea/${idusuario}`
      });
    }
  },

  /**
   * Comprueba si un elemento ya está en la lista de deseos del usuario.
   * @param {number} idusuario
   * @param {number} idelemento
   * @returns {Promise<boolean>}
   */
  async existDeseado(idusuario, idelemento) {
    try {
      const existe = await DeseaDAO.findOne(idusuario, idelemento);
      return !!existe;
    } catch (error) {
      throw new ErrorResponseDTO({
        code: 500,
        message: "Error interno al verificar si el elemento está en la lista de deseos.",
        path: `/desea/${idusuario}/${idelemento}`
      });
    }
  },

  /**
   * Elimina un elemento de la lista de deseos del usuario.
   * @param {number} idusuario
   * @param {number} idelemento
   * @returns {Promise<UsuarioDeseaElementoDTO|null>}
   */
  async deleteDeseado(idusuario, idelemento) {
    try {
      const existe = await DeseaDAO.findOne(idusuario, idelemento);
      if (!existe) return null;

      const eliminado = await DeseaDAO.delete(idusuario, idelemento);
      return new UsuarioDeseaElementoDTO(eliminado);
    } catch (error) {
      throw new ErrorResponseDTO({
        code: 500,
        message: "Error interno al eliminar el elemento deseado.",
        path: `/desea/${idusuario}/${idelemento}`,
      });
    }
  },

  /**
   * Agrega un elemento a la lista de deseos del usuario.
   * @param {UsuarioDeseaElementoDTO} data
   * @returns {Promise<UsuarioDeseaElementoDTO>}
   */
  async createDeseado(data) {
    try {
      const existe = await DeseaDAO.findOne(data.idusuario, data.idelemento);
      if (existe) {
        throw new ErrorResponseDTO({
          code: 409,
          message: "El elemento ya está en la lista del usuario.",
          path: `/desea`,
        });
      }

      const creado = await DeseaDAO.create(data);
      return new UsuarioDeseaElementoDTO(creado);
    } catch (error) {
      if (error instanceof ErrorResponseDTO) {
        throw error;
      }

      throw new ErrorResponseDTO({
        code: 500,
        message: "Error interno al crear el elemento deseado.",
        path: `/desea`,
      });
    }
  },


};
