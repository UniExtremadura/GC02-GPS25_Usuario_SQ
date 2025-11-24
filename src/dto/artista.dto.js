/**
 * @file artista.dto.js
 * @description DTO para representar un artista, extendiendo UsuarioDTO.
 */

import { UsuarioDTO } from "./usuario.dto.js";
import { GeneroDTO } from "./genero.dto.js";

/**
 * DTO que representa un artista del sistema.
 *
 * Extiende a UsuarioDTO, añadiendo información adicional propia del artista.
 *
 * Si el usuario no es artista (`esartista = false`), los campos extra se establecen a `null`.
 */
export class ArtistaDTO extends UsuarioDTO {
  constructor(data) {
    // Inicializa primero la parte de usuario
    super({
      id: data.id,
      nombreusuario: data.nombreusuario,
      nombrereal: data.nombrereal,
      contrasenia: data.contrasenia,
      correo: data.correo,
      descripcion: data.descripcion,
      fecharegistro: data.fecharegistro,
      rutafoto: data.rutafoto,
      esartista: data.esartista,
    });

    // Si NO es artista → no rellenamos los campos específicos
    if (!data.esartista) {
      this.esnovedad = null;
      this.oyentes = null;
      this.valoracion = null;
      this.genero = null;
      return;
    }

    // Datos del artista (pueden venir en data.artista o directamente en data)
    const a = data.artista ?? data;

    /** @type {boolean} */
    this.esnovedad = a.esnovedad ?? true;

    /** @type {number} */
    this.oyentes = a.oyentes ?? 0;

    /** @type {number} */
    this.valoracion = Number(a.valoracion ?? 0);

    /**
     * Género del artista.
     * Acepta:
     *  - data.genero = { id: X }
     *  - data.idgenero = X
     *  - null
     */
    const idGenero = data.genero?.id ?? data.idgenero ?? null;

    /** @type {GeneroDTO|null} */
    this.genero = idGenero ? new GeneroDTO({ id: data.genero?.id, nombre:data.genero?.nombre }) : null;
  }
}
