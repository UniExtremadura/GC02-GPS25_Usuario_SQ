/**
 * @file cesta.dao.js
 * @description Acceso a datos (DAO) para gestionar la tabla `usuario_cesta_elemento`,
 * que representa la cesta de compras de los usuarios.
 *
 * Este módulo encapsula todas las operaciones CRUD relacionadas con la cesta:
 * listar elementos, verificar si ya existe un elemento, añadir y eliminar items.
 *
 * @requires ../config/database.js
 */

import prisma from '../config/database.js';

/**
 * @namespace CestaDAO
 * @description Métodos de acceso a datos para la cesta de los usuarios.
 */
export const CestaDAO = {

  /**
   * Elimina un elemento de la cesta del usuario.
   *
   * @async
   * @function delete
   * @memberof CestaDAO
   *
   * @param {number} idusuario - ID del usuario.
   * @param {number} idelemento - ID del elemento.
   *
   * @returns {Promise<object>} Registro eliminado.
   *
   * @example
   * await CestaDAO.delete(15, 8);
   */
  async delete(idusuario, idelemento) {
    return prisma.usuario_cesta_elemento.delete({
      where: { idusuario_idelemento: { idusuario, idelemento } },
    });
  },

  /**
   * Crea un nuevo registro en la cesta del usuario.
   *
   * @async
   * @function create
   * @memberof CestaDAO
   *
   * @param {Object} data - Datos del registro (UsuarioCestaElementoDTO).
   * @param {number} data.idusuario - ID del usuario.
   * @param {number} data.idelemento - ID del elemento.
   *
   * @returns {Promise<object>} El registro recién creado.
   *
   * @example
   * await CestaDAO.create({ idusuario: 12, idelemento: 33 });
   */
  async create(data) {
    return prisma.usuario_cesta_elemento.create({
      data,
    });
  },
};
