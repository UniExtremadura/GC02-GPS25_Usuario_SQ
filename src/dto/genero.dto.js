/**
 * @file genero.dto.js
 * @description DTO que representa un género musical dentro del sistema
 * (por ejemplo: Rock, Pop, Trap, Jazz, etc).
 */

/**
 * DTO para un género musical.
 *
 * @class GeneroDTO
 *
 * @property {number} id - ID único del género.
 * @property {string|null} nombre - Nombre del género. Puede ser null si no se proporciona.
 *
 * @example
 * const genero = new GeneroDTO({
 *   id: 5,
 *   nombre: "Synthwave"
 * });
 *
 * @example
 * const generoNull = new GeneroDTO({
 *   id: 3
 * });
 */
export class GeneroDTO {
  constructor({ id, nombre }) {
    /** @type {number} */
    this.id = id;

    /** @type {string|null} */
    this.nombre = nombre ?? null;
  }
}
