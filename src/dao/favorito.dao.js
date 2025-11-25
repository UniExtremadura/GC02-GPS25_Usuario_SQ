/**
 * @file dao/favorito.dao.js
 * @description Acceso a datos para la tabla `usuario_favorito_elemento` mediante Prisma ORM.
 *
 * Este DAO centraliza las operaciones sobre la lista de favoritos de un usuario,
 * proporcionando métodos de consulta, creación y eliminación.
 *
 * @requires ../config/database.js
 */

import prisma from '../config/database.js';

/**
 * @namespace FavoritoDAO
 * @description Encapsula todas las operaciones CRUD relacionadas con los elementos favoritos de un usuario.
 */
export const FavoritoDAO = {
  
  /**
   * Crea un nuevo registro en la lista de favoritos.
   *
   * @async
   * @function create
   * @memberof FavoritoDAO
   *
   * @param {object} data - Datos del registro (UsuarioFavoritoElementoDTO).
   * @returns {Promise<object>} El registro creado.
   *
   * @example
   * await FavoritoDAO.create({ idusuario: 5, idelemento: 3, tipo: 1 });
   */
  async create(data) {
    return prisma.usuario_favorito_elemento.create({
      data,
    });
  },
};
