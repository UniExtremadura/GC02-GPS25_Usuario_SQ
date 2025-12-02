/**
 * @file comprado.service.js
 * @description Lógica de negocio relacionada con los elementos comprados del usuario.
 */

import { CompradoDAO } from '../dao/comprado.dao.js';
import { ElementoDTO } from '../dto/elemento.dto.js';
import { ErrorResponseDTO } from '../dto/errorResponse.dto.js';

export const CompradoService = {

  /**
   * Obtiene todos los elementos comprados por un usuario.
   *
   * @async
   * @function getCompradosByIdUsuario
   * @param {number} idusuario - ID del usuario.
   * @returns {Promise<Array<ElementoDTO>>} Lista de elementos comprados.
   * 
   * @description
   * Recupera las relaciones de compra en la tabla **tiene**  
   * y consulta el servicio de Contenidos para obtener la información completa  
   * de cada elemento comprado por el usuario.
   *
   * @throws {ErrorResponseDTO}
   * Error interno si ocurre un problema al obtener o procesar los datos.
   */
  async getCompradosByIdUsuario(idusuario) {
    try {
      const relaciones = await CompradoDAO.findAllByUsuario(idusuario);

      if (!relaciones.length) return [];

      const elementos = await Promise.all(
        relaciones.map(async (rel) => {
          const url = `${process.env.API_CONTENIDO}/elementos/${rel.idelemento}`;
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(`Error al obtener el elemento ${rel.idelemento}`);
          }

          const data = await response.json();
          return new ElementoDTO(data);
        })
      );

      return elementos;
    } catch (error) {
      console.error(error);
      throw new ErrorResponseDTO({
        code: 500,
        message: "Error interno al obtener los elementos comprados.",
        path: `/tiene/${idusuario}`,
      });
    }
  },

  /**
   * Registra la compra de todos los elementos de la cesta del usuario.
   *
   * @async
   * @function createComprados
   * @param {number} idusuario - ID del usuario.
   * @returns {Promise<boolean>} `true` si se registraron compras, `false` si la cesta estaba vacía.
   * 
   * @description
   * Inserta automáticamente todos los elementos actuales de la cesta en la tabla **tiene**  
   * (historial de compras).  
   * Si la cesta no contiene elementos → devuelve `false`.
   * 
   * @throws {ErrorResponseDTO}
   * Error interno si falla el proceso de registro de compra.
   */
  async createComprados(idusuario) {
    try {
      const result = await CompradoDAO.create(idusuario);
      return !!result;
    } catch (error) {
      console.error(error);
      throw new ErrorResponseDTO({
        code: 500,
        message: "Error interno al registrar los elementos comprados.",
        path: `/tiene/${idusuario}`,
      });
    }
  },

  /**
   * Verifica si el usuario ha comprado un elemento específico.
   *
   * @async
   * @function existComprado
   * @param {number} idusuario - ID del usuario.
   * @param {number} idelemento - ID del elemento.
   * @returns {Promise<boolean>} `true` si existe la compra, `false` si no.
   * 
   * @description
   * Consulta la tabla **tiene** para comprobar si el usuario ha comprado  
   * un contenido concreto.
   * 
   * @throws {ErrorResponseDTO}
   * Error interno si ocurre un problema al consultar la relación.
   */
  async existComprado(idusuario, idelemento) {
    try {
      const existe = await CompradoDAO.findOne(idusuario, idelemento);
      return !!existe;
    } catch (error) {
      console.error(error);
      throw new ErrorResponseDTO({
        code: 500,
        message: "Error interno al verificar si el elemento ha sido comprado.",
        path: `/tiene/${idusuario}/${idelemento}`,
      });
    }
  },
};
