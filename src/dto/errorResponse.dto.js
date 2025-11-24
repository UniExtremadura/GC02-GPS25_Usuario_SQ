/**
 * @file errorResponse.dto.js
 * @description DTO estándar para respuestas de error en la API.
 * Se utiliza para devolver errores homogéneos desde controladores y servicios.
 */

/**
 * Representa un error estructurado dentro de la API.
 *
 * @class ErrorResponseDTO
 *
 * @property {number} code - Código HTTP del error (400, 401, 404, 500...).
 * @property {string} message - Mensaje descriptivo del error.
 * @property {string|null} path - Ruta donde ocurrió el error, normalmente `req.originalUrl`.
 *
 * @example
 * // Error 404: recurso no encontrado
 * const error = new ErrorResponseDTO({
 *   code: 404,
 *   message: "Usuario no encontrado",
 *   path: "/api/usuarios/15"
 * });
 *
 * @example
 * // Error 500: fallo interno
 * const error = new ErrorResponseDTO({
 *   code: 500,
 *   message: "Error interno del servidor",
 *   path: "/api/usuarios"
 * });
 */
export class ErrorResponseDTO { 
  constructor({ code, message, path }) {

    /** @type {number} Código HTTP del error */
    this.code = code;

    /** @type {string} Descripción del error */
    this.message = message;

    /** @type {string|null} Endpoint donde ocurrió el error */
    this.path = path ?? null;
  }
}
