/**
 * @file dao/usuario.dao.js
 * @description Acceso a datos del modelo `Usuario` mediante Prisma ORM.
 * 
 * Este DAO encapsula todas las operaciones CRUD relacionadas con usuarios,
 * aislando la capa de datos del resto de la aplicación.  
 * Soporta ejecución dentro y fuera de transacciones mediante el parámetro `tx`.
 *
 * @requires ../config/database.js (instancia de Prisma)
 */

import prisma from '../config/database.js';

/**
 * @namespace UsuarioDAO
 * @description Contiene métodos para acceder y manipular usuarios en la base de datos.
 */
export const UsuarioDAO = {

  /**
   * Obtiene todos los usuarios de la base de datos.
   *
   * @async
   * @function findAll
   * @memberof UsuarioDAO
   *
   * @returns {Promise<Array<object>>} Lista de usuarios con sus datos de artista (si aplica).
   *
   * @example
   * const usuarios = await UsuarioDAO.findAll();
   */
  async findAll() {
    return prisma.usuario.findMany({
      include: { artista: true }
    });
  },

  /**
   * Busca un usuario por su ID.
   *
   * @async
   * @function findById
   * @memberof UsuarioDAO
   *
   * @param {number} id - ID del usuario.
   * @returns {Promise<object|null>} Usuario encontrado o `null` si no existe.
   *
   * @example
   * const usuario = await UsuarioDAO.findById(7);
   */
  async findById(id) {
    return prisma.usuario.findUnique({
      where: { id },
      include: { artista: true }
    });
  },

  /**
   * Crea un nuevo usuario en la base de datos.
   *
   * @async
   * @function create
   * @memberof UsuarioDAO
   *
   * @param {object} data - Datos del usuario a crear.
   * @param {PrismaClient|TransactionClient} [tx=prisma] - Cliente o transacción de Prisma.
   * @returns {Promise<object>} Usuario recién creado.
   *
   * @example
   * const nuevo = await UsuarioDAO.create({ nombreusuario: "test", ... });
   */
  async create(data, tx = prisma) {
    return tx.usuario.create({ data });
  },

  /**
   * Actualiza los datos de un usuario existente.
   * El campo `id` se separa para evitar su modificación.
   *
   * @async
   * @function update
   * @memberof UsuarioDAO
   *
   * @param {object} data - Objeto con los datos a actualizar (incluye `id`).
   * @param {PrismaClient|TransactionClient} [tx=prisma] - Cliente o transacción de Prisma.
   * @returns {Promise<object>} Usuario actualizado.
   *
   * @example
   * await UsuarioDAO.update({ id: 10, correo: "nuevo@mail.com" });
   */
  async update(data, tx = prisma) {
    const { id, ...updateData } = data;

    return tx.usuario.update({
      where: { id },
      data: updateData,
    });
  },

  /**
   * Elimina un usuario de la base de datos.
   *
   * @async
   * @function delete
   * @memberof UsuarioDAO
   *
   * @param {number|string} id - ID del usuario.
   * @param {PrismaClient|TransactionClient} [tx=prisma] - Cliente o transacción.
   * @returns {Promise<object>} Usuario eliminado.
   *
   * @example
   * await UsuarioDAO.delete(12);
   */
  async delete(id, tx = prisma) {
    return tx.usuario.delete({
      where: { id: Number(id) }
    });
  }
};
