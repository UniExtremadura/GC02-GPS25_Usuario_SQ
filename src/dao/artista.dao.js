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
};
