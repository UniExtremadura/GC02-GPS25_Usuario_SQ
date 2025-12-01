/**
 * @file artista.routes.js
 * @description Define las rutas relacionadas con los artistas dentro de la API.
 * Estas rutas permiten obtener la lista completa de artistas y consultar un artista específico.
 *
 * Endpoints:
 *   GET /api/usuarios/artistas        → Obtener todos los artistas
 *   GET /api/usuarios/artistas/:id    → Obtener un artista por ID
 */

import { Router } from 'express';
import { ArtistaController } from '../controllers/artista.controller.js';

const router = Router();

/**
 * @route GET /api/usuarios/artistas
 * @summary Obtener la lista de todos los artistas
 * @description
 * Devuelve todos los artistas registrados en la plataforma.
 * Los datos incluyen información general del usuario más los atributos propios del artista.
 *
 * @returns {Array<Artista>} 200 - Lista de artistas
 * @returns {ErrorResponseDTO} 500 - Error inesperado
 */
router.get('/', ArtistaController.getArtistas);

/**
 * @route GET /api/usuarios/artistas/:id
 * @summary Obtener los datos de un artista específico
 * @description
 * Devuelve los datos completos del artista identificado por su ID.
 * Si no existe, devuelve un error 404.
 *
 * @param {number} id - ID del artista
 * @returns {Artista} 200 - Artista encontrado
 * @returns {ErrorResponseDTO} 404 - Artista no encontrado
 * @returns {ErrorResponseDTO} 500 - Error inesperado
 */
router.get('/:id', ArtistaController.getArtistaById);

export default router;
