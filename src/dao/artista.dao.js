/**
 * @file artista.dao.js
 * @description Acceso a datos (DAO) para gestionar la tabla `artista` y los usuarios
 * que tienen el flag `esartista = true`.  
 * 
 * Incluye operaciones para obtener artistas, crear uno nuevo asociado a un usuario,
 * actualizar sus datos y eliminarlo.
 *
 * @requires ../config/database.js
 */

import prisma from '../config/database.js';

/**
 * @namespace ArtistaDAO
 * @description Métodos de acceso a datos para la entidad Artista.
 */
export const ArtistaDAO = {

  /**
   * Obtiene todos los usuarios que son artistas.
   *
   * @async
   * @function findAll
   * @memberof ArtistaDAO
   *
   * @returns {Promise<Array<object>>} Lista de usuarios artistas con datos extra.
   *
   * @example
   * const artistas = await ArtistaDAO.findAll();
   */
  async findAll() {
    return prisma.usuario.findMany({
      where: { esartista: true },
      include: { artista: true },
    });
  },

  /**
   * Obtiene un artista por su ID de usuario.
   *
   * @async
   * @function findById
   * @memberof ArtistaDAO
   *
   * @param {number} id - ID del usuario/artista.
   *
   * @returns {Promise<object|null>} El usuario-artista encontrado o `null`.
   *
   * @example
   * const artista = await ArtistaDAO.findById(12);
   */
  async findById(id) {
    return prisma.usuario.findUnique({
      where: { id, esartista: true },
      include: { artista: true },
    });
  },

  /**
   * Crea un nuevo registro en la tabla `artista`.
   * 
   * El parámetro `data` puede incluir un objeto `genero` o un campo `idgenero`.
   *
   * @async
   * @function create
   * @memberof ArtistaDAO
   *
   * @param {Object} data - Datos del artista.
   * @param {number} data.idusuario - ID del usuario asociado.
   * @param {Object} [data.genero] - Objeto de género `{ idgenero }`.
   * @param {number} [data.idgenero] - ID del género directamente.
   * @param {PrismaClient} [tx=prisma] - Transacción opcional.
   *
   * @returns {Promise<object>} Registro creado.
   *
   * @example
   * await ArtistaDAO.create({ idusuario: 5, idgenero: 2 });
   */
  async create(data, tx = prisma) {
    const { genero, ...rest } = data;
    return tx.artista.create({
      data: {
        ...rest,
        idgenero: genero?.idgenero ?? data.idgenero ?? null,
      },
    });
  },

  /**
   * Actualiza los datos de un artista existente.
   *
   * Soporta tanto `genero.id` como `idgenero` directo.
   *
   * @async
   * @function update
   * @memberof ArtistaDAO
   *
   * @param {Object} data - Nuevos datos del artista.
   * @param {number} data.idusuario - ID del usuario/artista.
   * @param {Object} [data.genero] - Objeto de género `{ id }`.
   * @param {number} [data.idgenero] - ID del género.
   * @param {PrismaClient} [tx=prisma] - Transacción opcional.
   *
   * @returns {Promise<object>} Registro actualizado.
   *
   * @example
   * await ArtistaDAO.update({
   *   idusuario: 5,
   *   genero: { id: 3 },
   *   valoracion: 4.9
   * });
   */
  async update(data, tx = prisma) {
    let { idusuario, genero, ...updateData } = data;

    if (genero?.id) {
      updateData.idgenero = genero.id;
    } else if (data.idgenero) {
      updateData.idgenero = data.idgenero;
    }

    return tx.artista.update({
      where: { idusuario },
      data: updateData,
    });
  },

  /**
   * Elimina un artista por su ID de usuario.
   *
   * @async
   * @function delete
   * @memberof ArtistaDAO
   *
   * @param {number} idusuario - ID del artista/usuario.
   * @param {PrismaClient} [tx=prisma] - Transacción opcional.
   *
   * @returns {Promise<object>} Registro eliminado.
   *
   * @example
   * await ArtistaDAO.delete(12);
   */
  async delete(idusuario, tx = prisma) {
    return tx.artista.delete({
      where: { idusuario: Number(idusuario) },
    });
  },
};
