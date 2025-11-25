/**
 * @file elemento.dto.js
 * @description Data Transfer Object para representar un Elemento.
 * Este DTO sirve para transportar datos sin exponer directamente
 * la entidad interna manejada por Prisma o la base de datos.
 */

/**
 * DTO que representa un elemento del catálogo (canción, álbum, etc.).
 *
 * @class ElementoDTO
 *
 * @property {number} id - ID único del elemento.
 * @property {string} nombre - Nombre del elemento.
 * @property {string|null} fechacrea - Fecha de creación en formato ISO (convertida desde LocalDateTime).
 * @property {string|null} descripcion - Descripción del elemento.
 * @property {string|null} urlFoto - URL de la imagen asociada al elemento.
 * @property {number|null} numventas - Número total de ventas.
 * @property {number|null} valoracion - Valoración media (0-5).
 * @property {number|null} precio - Precio del elemento.
 * @property {boolean|null} esnovedad - Indica si el elemento es una novedad.
 * @property {boolean|null} esalbum - Indica si el elemento es un álbum (true) o una canción (false).
 * @property {number|null} genero - ID del género principal.
 * @property {number|null} subgenero - ID del subgénero.
 * @property {number|null} artista - ID del artista creador.
 *
 * @example
 * const elemento = new ElementoDTO({
 *   id: 12,
 *   nombre: "Midnight Dreams",
 *   fechacrea: "2024-02-10T15:30:00.000Z",
 *   descripcion: "Nuevo single exclusivo",
 *   urlFoto: "/uploads/elementos/12.jpg",
 *   numventas: 132,
 *   valoracion: 4.8,
 *   precio: 1.99,
 *   esnovedad: true,
 *   esalbum: false,
 *   genero: 3,
 *   subgenero: 5,
 *   artista: 9
 * });
 */
export class ElementoDTO {
  constructor({
    id,
    nombre,
    fechacrea,
    descripcion,
    urlFoto,
    numventas,
    valoracion,
    precio,
    esnovedad,
    esalbum,
    genero,
    subgenero,
    artista
  }) {

    /** @type {number} */
    this.id = id;

    /** @type {string} */
    this.nombre = nombre;

    /** @type {string|null} Fecha en ISO */
    this.fechacrea = fechacrea ?? null;

    /** @type {string|null} */
    this.descripcion = descripcion ?? null;

    /** @type {string|null} */
    this.urlFoto = urlFoto ?? null;

    /** @type {number|null} */
    this.numventas = numventas ?? null;

    /** @type {number|null} */
    this.valoracion = valoracion ?? null;

    /** @type {number|null} */
    this.precio = precio ?? null;

    /** @type {boolean|null} */
    this.esnovedad = esnovedad ?? null;

    /** @type {boolean|null} */
    this.esalbum = esalbum ?? null;

    /** @type {number|null} */
    this.genero = genero ?? null;

    /** @type {number|null} */
    this.subgenero = subgenero ?? null;

    /** @type {number|null} */
    this.artista = artista ?? null;
  }
}
