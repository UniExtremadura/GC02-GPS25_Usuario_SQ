/**
 * @file artista.service.js
 * @description Lógica de negocio relacionada con artistas.
 * Obtiene información desde la base de datos a través del DAO,
 * enriquece los datos consultando el servicio de contenidos
 * (géneros musicales) y retorna DTOs preparados para la capa de control.
 */

import { ArtistaDAO } from '../dao/artista.dao.js';
import { ArtistaDTO } from '../dto/artista.dto.js';
import { ErrorResponseDTO } from '../dto/errorResponse.dto.js';
import dotenv from "dotenv";
dotenv.config();

export const ArtistaService = {

  /**
   * Obtiene la lista completa de artistas del sistema.
   * Para cada artista, consulta su género en el microservicio de Contenido
   * y mezcla la información antes de construir el DTO.
   *
   * @async
   * @function getArtistas
   *
   * @returns {Promise<Array<ArtistaDTO>>}
   *
   * @throws {ErrorResponseDTO}
   * Lanza error 500 si falla la comunicación con el servicio de contenidos.
   */
  async getArtistas() {
    try {
      const usuarios = await ArtistaDAO.findAll();
      if (!usuarios.length) return [];
      console.log(usuarios);
      
      // Llamadas paralelas a la API externa
      const usuariosCompletos = await Promise.all(
        usuarios.map(async (user) => {
          if (!user.artista || !user.artista.idgenero) {
            return new ArtistaDTO({ ...user, genero: null });
          }

          const url = `${process.env.API_CONTENIDO}/generos/${user.artista.idgenero}`;

          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Error al obtener el género ${user.artista.idgenero}`);
          }

          const genero = await response.json();
          const userCompleto = { ...user, genero };

          return new ArtistaDTO(userCompleto);
        })
      );

      return usuariosCompletos;

    } catch (error) {
      console.error(error);

      throw new ErrorResponseDTO({
        code: 500,
        message: "Error interno al obtener la lista de artistas.",
        path: `/artistas`
      });
    }
  },

  /**
   * Obtiene un artista por su ID.
   * Este método **no** enriquece los datos con Contenido (a diferencia de getArtistas),
   * ya que depende de cómo desees implementarlo.
   * Si deseas que también consulte Contenido, puedo añadírtelo.
   *
   * @async
   * @function getArtistaById
   *
   * @param {number} id - ID del artista a consultar.
   *
   * @returns {Promise<ArtistaDTO|null>}
   *
   * @throws {ErrorResponseDTO}
   * Se lanza si ocurre un error al consultar la base de datos.
   */
  async getArtistaById(id) {
    try {
      const usuario = await ArtistaDAO.findById(id);
      if (!usuario) return null;
      
      if (!usuario.artista || !usuario.artista.idgenero) {
        return new ArtistaDTO({ ...usuario, genero: null });
      }

      const url = `${process.env.API_CONTENIDO}/generos/${usuario.artista.idgenero}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al obtener el género ${usuario.artista.idgenero}`);
      }

      const genero = await response.json();
      const userCompleto = { ...usuario, genero };

      return new ArtistaDTO(userCompleto);

    } catch (error) {
      console.error(error);

      throw new ErrorResponseDTO({
        code: 500,
        message: "Error interno al obtener los datos del artista.",
        path: `/artistas/${id}`
      });
    }
  },
};
