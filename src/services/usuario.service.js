/**
 * @file usuario.service.js
 * @description Lógica de negocio para usuarios: listar, crear, obtener,
 * actualizar y eliminar. Interactúa con DAOs, Firebase y APIs externas.
 */

import { UsuarioDAO } from '../dao/usuario.dao.js';
import { UsuarioDTO } from '../dto/usuario.dto.js';
import { ArtistaDTO } from '../dto/artista.dto.js';
import { ErrorResponseDTO } from '../dto/errorResponse.dto.js';

export const UsuarioService = {
  /**
   * Obtiene un usuario completo por id (incluye datos de artista y género si aplica).
   * @async
   * @function obtenerUsuario
   * @param {number} id
   * @returns {Promise<UsuarioDTO|ArtistaDTO|null>}
   */
  async obtenerUsuario(id) {
    try {
      const usuario = await UsuarioDAO.findById(id);
      if (!usuario) return null;

      if (!usuario.esartista) return new UsuarioDTO(usuario);

      if (!usuario.artista || !usuario.artista.idgenero) return new ArtistaDTO({ ...usuario, genero: null });

      const url = `${process.env.API_CONTENIDO}/generos/${usuario.artista.idgenero}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error al obtener el género ${usuario.artista.idgenero}`);
      const genero = await response.json();

      return new ArtistaDTO({ ...usuario, genero });
    } catch (error) {
      console.error(error);
      throw new ErrorResponseDTO({ code: 500, message: 'Error al obtener usuario.', path: `/usuarios/${id}` });
    }
  },

};
