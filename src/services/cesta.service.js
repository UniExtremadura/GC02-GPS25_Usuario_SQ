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
