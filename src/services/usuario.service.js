/**
 * @file usuario.service.js
 * @description Lógica de negocio para usuarios: listar, crear, obtener,
 * actualizar y eliminar. Interactúa con DAOs, Firebase y APIs externas.
 */

import { UsuarioDAO } from '../dao/usuario.dao.js';
import { ArtistaDAO } from '../dao/artista.dao.js';
import { UsuarioDTO, UsuarioPublicDTO } from '../dto/usuario.dto.js';
import { ArtistaDTO } from '../dto/artista.dto.js';
import { ErrorResponseDTO } from '../dto/errorResponse.dto.js';
import prisma from '../config/database.js';
import { firebaseAdmin } from '../config/firebase.js';
import { separarDataUsuarioArtista } from '../utils/separarDataUsuarioArtista.js';

export const UsuarioService = {

  /**
   * Obtiene la lista de usuarios. Resuelve correctamente promesas anidadas con Promise.all.
   * @async
   * @function listarUsuarios
   * @returns {Promise<Array<UsuarioDTO|ArtistaDTO>>}
   * @throws {ErrorResponseDTO}
   */
  async listarUsuarios() {
    try {
      const usuarios = await UsuarioDAO.findAll();
      if (!usuarios?.length) return [];

      const elementos = await Promise.all(usuarios.map(async (user) => {
        if (!user.esartista) return new UsuarioDTO(user);

        // si es artista pero no tiene idgenero, devolvemos ArtistaDTO con genero null
        if (!user.artista?.idgenero) return new ArtistaDTO({ ...user, genero: null });

        // obtener género desde microservicio de contenidos
        const url = `${process.env.API_CONTENIDO}/generos/${user.artista.idgenero}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error al obtener el género ${user.artista.idgenero}`);
        const genero = await response.json();

        return new ArtistaDTO({ ...user, genero });
      }));

      return elementos;
    } catch (error) {
      console.error(error);
      throw new ErrorResponseDTO({ code: 500, message: 'Error interno al obtener la lista de usuarios.', path: '/usuarios' });
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
          await firebaseAdmin.auth().createUser({
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

      if (!usuario.artista?.idgenero) return new ArtistaDTO({ ...usuario, genero: null });

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
   * Logout: revoca tokens del usuario en Firebase.
   * @async
   * @function logout
   * @param {string} uid
   * @returns {Promise<boolean>}
   */
  async logout(uid) {
    try {
      await firebaseAdmin.auth().revokeRefreshTokens(String(uid));
      return true;
    } catch (error) {
      console.error(error);
      throw new ErrorResponseDTO({ code: 500, message: 'Error al eliminar el token', path: `/usuarios/logout` });
    }
  },

  /**
   * Actualiza usuario y artista (si aplica).
   * @async
   * @function updateUsuario
   * @param {Object} data
   * @returns {Promise<UsuarioDTO|ArtistaDTO|null>}
   */
  async updateUsuario(data) {
    try {
      const existArt = await ArtistaDAO.findById(data.id);
      const [usuarioData, artistaData] = separarDataUsuarioArtista(data, !!existArt);

      usuarioData.id = data.id;
      const usuario = await UsuarioDAO.update(usuarioData);
      if (!usuario) return null;

      if (!existArt) return new UsuarioDTO(usuario);

      if (artistaData) {
        artistaData.idusuario = data.id;
        await ArtistaDAO.update(artistaData);
      }

      const usuarioFinal = await UsuarioDAO.findById(data.id);
      if (!usuarioFinal.artista?.idgenero) {
        return new ArtistaDTO({ ...usuarioFinal, genero: null });
      }

      const url = `${process.env.API_CONTENIDO}/generos/${usuarioFinal.artista.idgenero}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error al obtener el género ${usuarioFinal.artista.idgenero}`);
      }

      const genero = await response.json();
      return new ArtistaDTO({
        ...usuarioFinal,
        genero
      });
    } catch (error) {
      console.error(error);
      throw new ErrorResponseDTO({ code: 500, message: 'Error al actualizar usuario.', path: `/usuarios` });
    }
  },

  /**
   * Elimina un usuario y su registro en Firebase dentro de una transacción.
   * @async
   * @function deleteUsuario
   * @param {number} id
   * @returns {Promise<UsuarioDTO>}
   */
  async deleteUsuario(id) {
    try {
      return await prisma.$transaction(async (tx) => {
        let deletedUsuario = await UsuarioDAO.delete(id, tx);
        if (!deletedUsuario) throw new ErrorResponseDTO({ code: 404, message: 'Usuario no encontrado', path: `/usuarios/${id}` });

        try {
          await firebaseAdmin.auth().deleteUser(String(deletedUsuario.id));
        } catch (firebaseError) {
          console.error('Error al eliminar usuario en Firebase:', firebaseError);
          // Reintentar o decidir política: en este diseño hacemos rollback lanzando error
          throw new Error('Error al eliminar usuario en Firebase');
        }

        return new UsuarioDTO(deletedUsuario);
      });
    } catch (error) {
      console.error(error);
      if (error instanceof ErrorResponseDTO) throw error;
      throw new ErrorResponseDTO({ code: 500, message: 'Error al eliminar usuario en Firebase o Base de Datos', path: `/usuarios/${id}` });
    }
  },

  /**
   * Lista usuarios públicos (DTO que oculta campos sensibles).
   * @async
   * @function listarUsuariosPubli
   * @returns {Promise<Array<UsuarioPublicDTO>>}
   */
  async listarUsuariosPubli() {
    try {
      const usuarios = await UsuarioDAO.findAll();
      return usuarios.map(u => new UsuarioPublicDTO(u));
    } catch (error) {
      console.error(error);
      throw new ErrorResponseDTO({ code: 500, message: 'Error al listar usuarios públicos', path: '/usuarios' });
    }
  },

  /**
   * Obtiene la información pública de un usuario por id.
   * @async
   * @function obtenerUsuarioPubli
   * @param {number} id
   * @returns {Promise<UsuarioPublicDTO|null>}
   */
  async obtenerUsuarioPubli(id) {
    try {
      const usuario = await UsuarioDAO.findById(id);
      if (!usuario) return null;
      return new UsuarioPublicDTO(usuario);
    } catch (error) {
      console.error(error);
      throw new ErrorResponseDTO({ code: 500, message: 'Error al obtener usuario público', path: `/usuarios/${id}` });
    }
  },

};
