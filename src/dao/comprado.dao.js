/**
 * @file comprado.dao.js
 * @description Acceso a datos (DAO) para gestionar la tabla `usuario_tiene_elemento`,
 * que representa los elementos comprados por los usuarios.
 *
 * Este módulo encapsula la lógica de compra y el traspaso automático de elementos
 * desde la cesta a la lista de elementos obtenidos.  
 * Se utiliza una transacción Prisma para garantizar integridad en la operación.
 *
 * @requires ../config/database.js
 */

import prisma from '../config/database.js';

/**
 * @namespace CompradoDAO
 * @description Métodos de acceso a datos para compras de usuarios.
 */
export const CompradoDAO = {

  /**
   * Registra una compra para un usuario:
   *  - Obtiene todos los elementos de la cesta del usuario.
   *  - Los inserta en `usuario_tiene_elemento`.
   *  - Vacía la cesta.
   *
   * Todo se ejecuta dentro de una transacción para evitar inconsistencias.
   *
   * @async
   * @function create
   * @memberof CompradoDAO
   *
   * @param {number} idusuario - ID del usuario que realiza la compra.
   * @param {import('@prisma/client').PrismaClient} [tx=prisma] - Cliente o transacción Prisma.
   *
   * @returns {Promise<boolean>} `true` si la operación se completó correctamente.
   *
   * @throws {Error} Si la cesta está vacía o si falla la transacción.
   *
   * @example
   * await CompradoDAO.create(12);
   */
  async create(idusuario, tx = prisma) {
    return tx.$transaction(async (trx) => {
      // Obtener elementos en la cesta del usuario
      const elementosEnCesta = await trx.usuario_cesta_elemento.findMany({
        where: { idusuario },
        select: { idelemento: true },
      });

      if (elementosEnCesta.length === 0) {
        throw new Error("La cesta está vacía, no se puede completar la compra");
      }

      // Transformación a registros de compra
      const nuevosComprados = elementosEnCesta.map((e) => ({
        idusuario,
        idelemento: e.idelemento,
        fecha: new Date(),
      }));

      // Insertar registros de compra (evitando duplicados)
      await trx.usuario_tiene_elemento.createMany({
        data: nuevosComprados,
        skipDuplicates: true,
      });

      // Vaciar la cesta
      await trx.usuario_cesta_elemento.deleteMany({
        where: { idusuario },
      });

      return true;
    });
  },

  /**
   * Obtiene todos los elementos que un usuario ha comprado.
   *
   * @async
   * @function findAllByUsuario
   * @memberof CompradoDAO
   *
   * @param {number} idusuario - ID del usuario.
   * @returns {Promise<Array<object>>} Lista detallada de compras, incluyendo usuario.
   *
   * @example
   * const compras = await CompradoDAO.findAllByUsuario(5);
   */
  async findAllByUsuario(idusuario) {
    return prisma.usuario_tiene_elemento.findMany({
      where: { idusuario },
      include: {
        usuario: {
          select: { id: true, nombreusuario: true, correo: true },
        },
      },
      orderBy: { fecha: 'desc' },
    });
  },

  /**
   * Busca si un usuario ya posee un elemento concreto.
   *
   * @async
   * @function findOne
   * @memberof CompradoDAO
   *
   * @param {number} idusuario - ID del usuario.
   * @param {number} idelemento - ID del elemento.
   *
   * @returns {Promise<object|null>} Registro encontrado o `null`.
   *
   * @example
   * const existe = await CompradoDAO.findOne(12, 9);
   */
  async findOne(idusuario, idelemento) {
    return prisma.usuario_tiene_elemento.findUnique({
      where: { idusuario_idelemento: { idusuario, idelemento } },
    });
  },

  /**
   * Obtiene todos los registros de compra.  
   * **Solo recomendado para administración o depuración.**
   *
   * @async
   * @function findAll
   * @memberof CompradoDAO
   *
   * @returns {Promise<Array<object>>} Lista completa de registros de compras.
   *
   * @example
   * const all = await CompradoDAO.findAll();
   */
  async findAll() {
    return prisma.usuario_tiene_elemento.findMany({
      include: {
        usuario: { select: { id: true, nombreusuario: true } },
      },
      orderBy: [{ idusuario: 'asc' }, { fecha: 'desc' }],
    });
  },
};
