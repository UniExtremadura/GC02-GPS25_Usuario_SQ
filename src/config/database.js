/**
 * @file database.js
 * @description Inicialización y exportación del cliente Prisma para el acceso a la base de datos.
 *
 * Este módulo crea una única instancia de `PrismaClient` y la exporta para ser
 * reutilizada en todo el proyecto. De esta forma se evita crear múltiples
 * conexiones innecesarias a la base de datos y se garantiza un acceso centralizado.
 *
 * Prisma se encarga automáticamente del manejo de conexiones,
 * reconexiones y del pool interno.
 *
 * @example
 * // Uso en un DAO o servicio(transacciones):
 * import prisma from "../config/prisma.js";
 *
 * const usuarios = await prisma.usuario.findMany();
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); //instancia singelton de prisma
export default prisma;