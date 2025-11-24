/**
 * @file comprado.service.js
 * @description Lógica de negocio relacionada con los elementos comprados del usuario.
 */

import { CompradoDAO } from '../dao/comprado.dao.js';
import { ErrorResponseDTO } from '../dto/errorResponse.dto.js';

export const CompradoService = {

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
      throw new ErrorResponseDTO({
        code: 500,
        message: "Error interno al registrar los elementos comprados.",
        path: `/tiene/${idusuario}`,
      });
    }
  },

};
