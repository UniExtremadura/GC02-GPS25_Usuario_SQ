/**
 * @file desea.dao.js
 * @description Acceso a datos (DAO) para gestionar la tabla `usuario_desea_elemento`,
 * que almacena la lista de deseos de los usuarios.
 *
 * Este módulo encapsula todas las operaciones CRUD relacionadas con la relación
 * usuario ↔ elemento marcado como “deseado”.  
 * Utiliza la clave compuesta (idusuario, idelemento) definida en Prisma.
 *
 * @requires ../config/database.js
 */

import prisma from '../config/database.js';

/**
 * @namespace DeseaDAO
 * @description Métodos de acceso a datos para la gestión de la lista de deseos del usuario.
 */
export const DeseaDAO = {

  /**
   * Obtiene todos los elementos deseados por un usuario.
   *
   * @async
   * @function findAllByUsuario
   * @memberof DeseaDAO
   *
   * @param {number} idusuario - ID del usuario.
   * @returns {Promise<Array<object>>} Lista de registros encontrados.
   *
   * @example
   * const lista = await DeseaDAO.findAllByUsuario(7);
   */
  async findAllByUsuario(idusuario) {
    return prisma.usuario_desea_elemento.findMany({
      where: { idusuario },
    });
  },

  /**
   * Busca si un usuario ya tiene un elemento marcado como deseado.
   *
   * @async
   * @function findOne
   * @memberof DeseaDAO
   *
   * @param {number} idusuario - ID del usuario.
   * @param {number} idelemento - ID del elemento.
   * @returns {Promise<object|null>} Registro encontrado o `null` si no existe.
   *
   * @example
   * const existe = await DeseaDAO.findOne(7, 12);
   */
  async findOne(idusuario, idelemento) {
    return prisma.usuario_desea_elemento.findUnique({
      where: { idusuario_idelemento: { idusuario, idelemento } },
    });
  },

  /**
   * Elimina un elemento de la lista de deseados del usuario.
   *
   * @async
   * @function delete
   * @memberof DeseaDAO
   *
   * @param {number} idusuario - ID del usuario.
   * @param {number} idelemento - ID del elemento.
   * @returns {Promise<object>} El registro eliminado.
   *
   * @example
   * await DeseaDAO.delete(5, 8);
   */
  async delete(idusuario, idelemento) {
    return prisma.usuario_desea_elemento.delete({
      where: { idusuario_idelemento: { idusuario, idelemento } },
    });
  },

  /**
   * Crea un nuevo registro en la lista de deseos.
   *
   * @async
   * @function create
   * @memberof DeseaDAO
   *
   * @param {object} data - Datos del registro.
   * @param {number} data.idusuario - ID del usuario.
   * @param {number} data.idelemento - ID del elemento.
   * @returns {Promise<object>} Registro creado.
   *
   * @example
   * await DeseaDAO.create({ idusuario: 3, idelemento: 15 });
   */
  async create(data) {
    return prisma.usuario_desea_elemento.create({
      data,
    });
  },
};
