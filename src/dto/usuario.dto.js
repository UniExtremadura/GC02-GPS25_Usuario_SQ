/**
 * @file usuario.dto.js
 * @description DTOs para representar usuarios en diferentes contextos:
 * - `UsuarioDTO`: información completa del usuario (incluye datos privados como la contraseña).
 * - `UsuarioPublicDTO`: versión pública del usuario sin datos sensibles.
 */

/**
 * DTO que representa un usuario interno del sistema.
 * Incluye información completa, incluyendo campos privados como la contraseña.
 *
 * @class UsuarioDTO
 *
 * @property {number|null} id - ID del usuario.
 * @property {string} nombreusuario - Nombre de usuario (único).
 * @property {string} nombrereal - Nombre real del usuario.
 * @property {string|null} contrasenia - Contraseña (puede ser null si no se pasa).
 * @property {string} correo - Correo electrónico.
 * @property {string|null} descripcion - Descripción opcional del usuario.
 * @property {Date|null} fecharegistro - Fecha de registro como objeto Date.
 * @property {string|null} rutafoto - Ruta de la foto de perfil.
 * @property {boolean} esartista - Indica si el usuario es artista.
 *
 * @example
 * const u = new UsuarioDTO({
 *   id: 5,
 *   nombreusuario: "john123",
 *   nombrereal: "John Doe",
 *   contrasenia: "1234abcd",
 *   correo: "john@example.com",
 *   descripcion: "Me encanta la música",
 *   fecharegistro: "2024-01-10T15:00:00Z",
 *   rutafoto: "perfil5.jpg",
 *   esartista: true,
 * });
 */
export class UsuarioDTO {
  constructor({
    id,
    nombreusuario,
    nombrereal,
    contrasenia,
    correo,
    descripcion,
    fecharegistro,
    rutafoto,
    esartista,
  }) {
    /** @type {number|null} */
    this.id = id ?? null;

    /** @type {string} */
    this.nombreusuario = nombreusuario;

    /** @type {string} */
    this.nombrereal = nombrereal;

    /** @type {string|null} */
    this.contrasenia = contrasenia ?? null;

    /** @type {string} */
    this.correo = correo;

    /** @type {string|null} */
    this.descripcion = descripcion ?? null;

    /** @type {Date|null} */
    this.fecharegistro = fecharegistro ? new Date(fecharegistro) : null;

    /** @type {string|null} */
    this.rutafoto = rutafoto ?? null;

    /** @type {boolean} */
    this.esartista = esartista ?? false;
  }
}

/**
 * DTO público del usuario, pensado para ser devuelto en respuestas públicas
 * o en listados donde no deben incluirse datos sensibles.
 *
 * @class UsuarioPublicDTO
 *
 * @property {number|null} id - ID del usuario.
 * @property {string} nombreusuario - Nombre visible del usuario.
 * @property {string|null} descripcion - Descripción pública del perfil.
 * @property {string|null} rutafoto - Ruta de la foto de perfil.
 * @property {boolean} esartista - Indica si el usuario es artista.
 *
 * @example
 * const u = new UsuarioPublicDTO({
 *   id: 7,
 *   nombreusuario: "artistman",
 *   descripcion: "Artista de electro-pop",
 *   rutafoto: "perfil7.jpg",
 *   esartista: true,
 * });
 */
export class UsuarioPublicDTO {
  constructor({
    id,
    nombreusuario,
    descripcion,
    rutafoto,
    esartista,
  }) {
    /** @type {number|null} */
    this.id = id ?? null;

    /** @type {string} */
    this.nombreusuario = nombreusuario;

    /** @type {string|null} */
    this.descripcion = descripcion ?? null;

    /** @type {string|null} */
    this.rutafoto = rutafoto ?? null;

    /** @type {boolean} */
    this.esartista = esartista ?? false;
  }
}
