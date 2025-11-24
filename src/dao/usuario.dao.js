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

};
