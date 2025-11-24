/**
 * @file relacion.dto.js
 * @description DTOs que representan relaciones entre usuarios y elementos:
 * lista de deseos, favoritos, comprados y cesta.
 * Incluye una clase base para evitar duplicación y asegurar coherencia.
 */

/**
 * Clase base para relaciones entre un usuario y un elemento.
 * Incluye los campos comunes a todas las listas (desea, favorito, tiene, cesta).
 *
 * @class RelacionBaseDTO
 *
 * @property {number} idusuario - ID del usuario propietario de la relación.
 * @property {number} idelemento - ID del elemento relacionado.
 * @property {Date|null} fecha - Fecha asociada a la relación (ej: compra).
 *
 * @example
 * const rel = new RelacionBaseDTO({
 *   idusuario: 10,
 *   idelemento: 55,
 *   fecha: "2024-02-18T12:00:00Z"
 * });
 */

export class RelacionBaseDTO {
  constructor({ idusuario, idelemento, fecha }) {
    /** @type {number} */
    this.idusuario = idusuario;

    /** @type {number} */
    this.idelemento = idelemento;

    /** @type {Date|null} */
    this.fecha = fecha ? new Date(fecha) : null;
  }
}

/**
 * DTO para elementos favoritos del usuario.
 * Extiende la relación base e incorpora el campo `tipo`.
 *
 * @class UsuarioFavoritoElementoDTO
 * @extends RelacionBaseDTO
 *
 * @property {number} tipo - Tipo de favorito:
 *  - 0 → Artista  
 *  - 1 → Canción  
 *  - 2 → Álbum  
 *
 * @example
 * const fav = new UsuarioFavoritoElementoDTO({
 *   idusuario: 4,
 *   idelemento: 99,
 *   tipo: 1,
 *   fecha: "2024-01-10"
 * });
 */
export class UsuarioFavoritoElementoDTO extends RelacionBaseDTO {
  constructor({ idusuario, idelemento, tipo, fecha }) {
    super({ idusuario, idelemento, fecha });

    /** @type {number} */
    this.tipo = tipo ?? 0;
  }
}

/**
 * DTO para elementos comprados por el usuario (usuario_tiene_elemento).
 * Solo utiliza los campos base.
 *
 * @class UsuarioTieneElementoDTO
 * @extends RelacionBaseDTO
 *
 * @example
 * const compra = new UsuarioTieneElementoDTO({
 *   idusuario: 4,
 *   idelemento: 123,
 *   fecha: "2024-02-20"
 * });
 */
export class UsuarioTieneElementoDTO extends RelacionBaseDTO {}

/**
 * DTO para elementos deseados por el usuario (lista de deseos).
 *
 * @class UsuarioDeseaElementoDTO
 * @extends RelacionBaseDTO
 *
 * @example
 * const deseo = new UsuarioDeseaElementoDTO({
 *   idusuario: 7,
 *   idelemento: 80
 * });
 */
export class UsuarioDeseaElementoDTO extends RelacionBaseDTO {}

/**
 * DTO para elementos que están en la cesta del usuario.
 *
 * @class UsuarioCestaElementoDTO
 * @extends RelacionBaseDTO
 *
 * @example
 * const cesta = new UsuarioCestaElementoDTO({
 *   idusuario: 3,
 *   idelemento: 40
 * });
 */
export class UsuarioCestaElementoDTO extends RelacionBaseDTO {}
