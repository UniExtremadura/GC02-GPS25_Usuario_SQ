/**
 * @file artista.controller.js
 * @description Controlador para la gestión de los artistas de la plataforma.
 * Expone los endpoints definidos en la capa de rutas y delega la lógica de negocio
 * en el ArtistaService, incluyendo la transformación de datos mediante DTOs.
 */

import { ArtistaService } from '../services/artista.service.js';
import { ErrorResponseDTO } from '../dto/errorResponse.dto.js';

export const ArtistaController = {

  /**
   * Obtiene todos los artistas registrados.
   *
   * @async
   * @function getArtistas
   * @route GET /artistas
   *
   * @description Devuelve la lista completa de artistas.  
   * Incluye los datos del género asociados a través del componente de contenidos.
   *
   * @param {import('express').Request} req - Petición HTTP.
   * @param {import('express').Response} res - Respuesta HTTP.
   *
   * @returns {Promise<Array<ArtistaDTO>|ErrorResponseDTO>}
   *
   * @response 200 - Lista de artistas obtenida correctamente.
   * @response 500 - Error interno del servidor.
   */
  async getArtistas(req, res) {
    try {
      
      const data = await ArtistaService.getArtistas();
      res.status(200).json(data);
    } catch (error) {
      console.error(error);

      if (error instanceof ErrorResponseDTO) {
        return res.status(error.code).json(error);
      }

      res.status(500).json(
        new ErrorResponseDTO({
          code: 500,
          message: 'Error inesperado al obtener los artistas.',
          path: req.originalUrl,
        })
      );
    }
  },

  /**
   * Obtiene los datos detallados de un artista por su ID.
   *
   * @async
   * @function getArtistaById
   * @route GET /artistas/:id
   *
   * @description Devuelve la información completa de un artista específico,  
   * incluyendo su género recuperado desde el componente de contenidos.
   *
   * @param {import('express').Request} req - Petición HTTP.
   * @param {import('express').Response} res - Respuesta HTTP.
   *
   * @returns {Promise<ArtistaDTO|ErrorResponseDTO>}
   *
   * @response 200 - Artista encontrado y devuelto.
   * @response 404 - No existe ningún artista con el ID proporcionado.
   * @response 500 - Error interno del servidor.
   */
  async getArtistaById(req, res) {
    try {
      const id = Number.parseInt(req.params.id);
      const data = await ArtistaService.getArtistaById(id);

      if (!data) {
        return res.status(404).json(
          new ErrorResponseDTO({
            code: 404,
            message: 'No se encontró ningún artista con el ID proporcionado.',
            path: req.originalUrl,
          })
        );
      }

      res.status(200).json(data);
    } catch (error) {
      console.error(error);

      if (error instanceof ErrorResponseDTO) {
        return res.status(error.code).json(error);
      }

      res.status(500).json(
        new ErrorResponseDTO({
          code: 500,
          message: 'Error inesperado al obtener los datos del artista.',
          path: req.originalUrl,
        })
      );
    }
  },

};
