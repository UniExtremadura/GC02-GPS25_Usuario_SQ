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
   * Obtiene todos los elementos favoritos asociados a un usuario.
   *
   * @async
   * @function findAllByUsuario
   * @memberof FavoritoDAO
   *
   * @param {number} idusuario - ID del usuario.
   * @returns {Promise<Array<object>>} Lista de registros favoritos del usuario.
   *
   * @example
   * const favoritos = await FavoritoDAO.findAllByUsuario(5);
   */
  async findAllByUsuario(idusuario) {
    return prisma.usuario_favorito_elemento.findMany({
      where: { idusuario },
    });
  },

  /**
   * Busca si un usuario tiene un elemento marcado como favorito.
   *
   * @async
   * @function findOne
   * @memberof FavoritoDAO
   *
   * @param {number} idusuario - ID del usuario.
   * @param {number} idelemento - ID del elemento.
   * @param {Array<number>} tipo - Lista de tipos permitidos (por ejemplo: [1,2]).
   * @returns {Promise<object|null>} El favorito encontrado o `null` si no existe.
   *
   * @example
   * const fav = await FavoritoDAO.findOne(5, 12, [1]);
   */
  async findOne(idusuario, idelemento, tipo) {
    return prisma.usuario_favorito_elemento.findFirst({
      where: { idusuario, idelemento, tipo: { in: tipo } },
    });
  },

  /**
   * Elimina un elemento de la lista de favoritos del usuario.
   *
   * @async
   * @function delete
   * @memberof FavoritoDAO
   *
   * @param {number} idusuario - ID del usuario.
   * @param {number} idelemento - ID del elemento.
   * @param {Array<number>} tipo - Tipos permitidos a eliminar.
   * @returns {Promise<object>} Resultado de la operación (`count` indica cuántos registros se eliminaron).
   *
   * @example
   * const result = await FavoritoDAO.delete(5, 10, [1]);
   * console.log(result.count); // → 1 si se eliminó
   */
  async delete(idusuario, idelemento, tipo) {
    return prisma.usuario_favorito_elemento.deleteMany({
      where: { idusuario, idelemento, tipo: { in: tipo } },
    });
  },

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
