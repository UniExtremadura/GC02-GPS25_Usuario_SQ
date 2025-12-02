/**
 * @file cesta.service.js
 * @description Lógica de negocio relacionada con la cesta del usuario.
 * Gestiona consultas, inserciones, verificaciones y eliminaciones de elementos en la cesta.
 */

import { CestaDAO } from '../dao/cesta.dao.js';
import { CestaDTO, CestaItemDTO } from '../dto/cesta.dto.js';
import { UsuarioCestaElementoDTO } from '../dto/relacion.dto.js';
import { ErrorResponseDTO } from '../dto/errorResponse.dto.js';

export const CestaService = {

  /**
   * Obtiene la cesta completa de un usuario.
   *
   * @async
   * @function getCestaByUser
   * @param {number} idusuario - ID del usuario.
   * @returns {Promise<CestaDTO>}
   *
   * @description
   * Recupera todos los elementos en la cesta del usuario y completa la información
   * solicitando los datos al servicio de Contenido.  
   * Devuelve una instancia de CestaDTO que incluye la lista de items y el total acumulado.
   *
   * @throws {ErrorResponseDTO} Error interno al obtener los datos.
   */
  async getCestaByUser(idusuario) {
    try {
      const elementos = await CestaDAO.findAllByUsuario(idusuario);

      // Si no tiene elementos → cesta vacía
      if (!elementos || elementos.length === 0) {
        return new CestaDTO({ items: [] });
      }

      const items = await Promise.all(
        elementos.map(async (elem) => {
          const url = `${process.env.API_CONTENIDO}/elementos/${elem.idelemento}`;
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(`Error al obtener elemento ${elem.idelemento}`);
          }

          const data = await response.json();

          return new CestaItemDTO({
            idelemento: elem.idelemento,
            nombre: data.nombre,
            precio: Number.parseFloat(data.precio.toFixed(2)),
            rutaimagen: data.urlFoto ?? null,
            tipo: data.esalbum ? 2 : 1, // 1 = canción, 2 = álbum
          });
        })
      );

      return new CestaDTO({ items });
    } catch (error) {
      throw new ErrorResponseDTO({
        code: 500,
        message: "Error interno al obtener la cesta del usuario.",
        path: `/cesta/${idusuario}`,
      });
    }
  },

  /**
   * Verifica si un elemento está en la cesta del usuario.
   *
   * @async
   * @function existItemCesta
   * @param {number} idusuario - ID del usuario.
   * @param {number} idelemento - ID del elemento.
   * @returns {Promise<boolean>} `true` si existe, `false` si no.
   *
   * @description
   * Consulta la base de datos para saber si el elemento ya está en la cesta del usuario.
   *
   * @throws {ErrorResponseDTO} Error interno al verificar el estado.
   */
  async existItemCesta(idusuario, idelemento) {
    try {
      const existe = await CestaDAO.findOne(idusuario, idelemento);
      return !!existe;
    } catch (error) {
      throw new ErrorResponseDTO({
        code: 500,
        message: "Error interno al verificar si el elemento está en la cesta.",
        path: `/cesta/${idusuario}/${idelemento}`,
      });
    }
  },

  /**
   * Elimina un elemento de la cesta del usuario.
   *
   * @async
   * @function deleteItemCesta
   * @param {number} idusuario - ID del usuario.
   * @param {number} idelemento - ID del elemento.
   * @returns {Promise<UsuarioCestaElementoDTO|null>}  
   * - DTO de la relación eliminada,  
   * - `null` si no existe.
   *
   * @description
   * Comprueba si la relación existe y, si es así, la elimina.
   *
   * @throws {ErrorResponseDTO} Error interno al intentar eliminar.
   */
  async deleteItemCesta(idusuario, idelemento) {
    try {
      const existe = await CestaDAO.findOne(idusuario, idelemento);
      if (!existe) return null;

      const eliminado = await CestaDAO.delete(idusuario, idelemento);
      return new UsuarioCestaElementoDTO(eliminado);

    } catch (error) {
      throw new ErrorResponseDTO({
        code: 500,
        message: "Error interno al eliminar el elemento de la cesta.",
        path: `/cesta/${idusuario}/${idelemento}`,
      });
    }
  },

  /**
   * Agrega un elemento a la cesta del usuario.
   *
   * @async
   * @function createItemCesta
   * @param {UsuarioCestaElementoDTO} data - Datos de la relación a crear.
   * @returns {Promise<UsuarioCestaElementoDTO>}
   *
   * @description
   * Inserta un nuevo registro en la tabla de cesta.  
   * Si ya existe → lanza un error 409.
   *
   * @throws {ErrorResponseDTO}  
   * - 409 si el elemento ya está en la cesta.  
   * - 500 si ocurre un error inesperado.
   */
  async createItemCesta(data) {
    try {
      const existe = await CestaDAO.findOne(data.idusuario, data.idelemento);

      if (existe) {
        throw new ErrorResponseDTO({
          code: 409,
          message: "El elemento ya está en la cesta del usuario.",
          path: `/cesta`,
        });
      }

      const creado = await CestaDAO.create(data);
      return new UsuarioCestaElementoDTO(creado);

    } catch (error) {

      // Si ya es un error controlado → lanzarlo tal cual
      if (error instanceof ErrorResponseDTO) {
        throw error;
      }

      throw new ErrorResponseDTO({
        code: 500,
        message: "Error interno al crear el elemento de la cesta.",
        path: `/cesta`,
      });
    }
  },

};
