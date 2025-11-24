/**
 * @file usuario.service.js
 * @description Lógica de negocio para usuarios: listar, crear, obtener,
 * actualizar y eliminar. Interactúa con DAOs, Firebase y APIs externas.
 */

import { ArtistaDAO } from '../dao/artista.dao.js';
import { UsuarioDTO, UsuarioPublicDTO } from '../dto/usuario.dto.js';
import { ArtistaDTO } from '../dto/artista.dto.js';
import { ErrorResponseDTO } from '../dto/errorResponse.dto.js';
import prisma from '../config/database.js';
import { firebaseAdmin } from '../config/firebase.js';
import { separarDataUsuarioArtista } from '../utils/separarDataUsuarioArtista.js';

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
  
  /**
   * Crea un usuario y su artista asociado (si aplica) en una transacción.
   * - Separa los datos de usuario y artista.
   * - Crea en base de datos y en Firebase; en caso de fallo hace rollback en Firebase.
   * @async
   * @function createUsuario
   * @param {Object} data
   * @returns {Promise<UsuarioDTO|ArtistaDTO>}
   * @throws {ErrorResponseDTO}
   */
  async createUsuario(data) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        let firebaseUser = null;
        try {
          const [usuarioData, artistaData] = separarDataUsuarioArtista(data, !!data.esartista);

          const usuario = await UsuarioDAO.create(usuarioData, tx);

          let artista = null;
          if (artistaData) {
            artistaData.idusuario = usuario.id;
            artista = await ArtistaDAO.create(artistaData, tx);
          }

          // crear usuario en Firebase con UID igual al id de la BD
          firebaseUser = await firebaseAdmin.auth().createUser({
            uid: String(usuario.id),
            email: usuario.correo,
            password: data.contrasenia,
            displayName: usuario.nombreusuario,
          });

          if (artista) {
            const userart = { ...usuario, ...artista, genero: data.genero ?? null };
            return new ArtistaDTO(userart);
          }

          return new UsuarioDTO(usuario);
        } catch (error) {
          // limpiar en Firebase si se creó algo
          if (firebaseUser) {
            try { await firebaseAdmin.auth().deleteUser(firebaseUser.uid); } catch (cleanupError) { console.error('Error cleanup Firebase:', cleanupError); }
          }
          console.error('Error en creación de usuario:', error);
          throw error; // será capturado por el catch externo y transformado
        }
      });

      return result;
    } catch (error) {
      // si es un ErrorResponseDTO ya lanzado, propagarlo; si no, envolverlo
      if (error instanceof ErrorResponseDTO) throw error;
      throw new ErrorResponseDTO({ code: 500, message: 'Error al crear usuario en Firebase o Base de Datos.', path: '/usuarios' });
    }
  },


};
