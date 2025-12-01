/**
 * @file favorito.routes.js
 * @description Define las rutas relacionadas con los favoritos del usuario.
 * Todas las rutas requieren autenticación mediante Firebase JWT.
 */

import { Router } from 'express';
import { verifyFirebaseToken } from "../middlewares/authJWTFirebase.js";
import { FavoritoController } from '../controllers/favorito.controller.js';

const router = Router();

/**
 * @route GET /api/usuarios/favoritos/:idusuario
 * @description
 * Obtiene todos los elementos que el usuario tiene marcados como favoritos.
 * Incluye artistas, canciones y álbumes, consultando el servicio de Contenido
 * para obtener los datos completos de cada tipo de elemento.
 *
 * @access Privado (requiere JWT Firebase)
 * @param {number} idusuario - ID del usuario cuyos favoritos se desean obtener.
 *
 * @returns {Array<ElementoDTO|ArtistaDTO>|ErrorResponseDTO}
 * Lista detallada de los favoritos del usuario.
 */
router.get('/:idusuario', verifyFirebaseToken, FavoritoController.getFavoritosByUser);


/**
 * @route GET /api/usuarios/favoritos/:idusuario/:idelemento/artista
 * @description
 * Verifica si un artista específico está marcado como favorito por el usuario.
 *
 * @access Privado (requiere JWT Firebase)
 * @param {number} idusuario - ID del usuario.
 * @param {number} idelemento - ID del artista.
 *
 * @returns {boolean|ErrorResponseDTO}
 * Indica si el artista está en la lista de favoritos.
 */
router.get('/:idusuario/:idelemento/artista', verifyFirebaseToken, FavoritoController.existArt);


/**
 * @route DELETE /api/usuarios/favoritos/:idusuario/:idelemento/artista
 * @description
 * Elimina un artista de la lista de favoritos del usuario.
 * Si el artista no estaba marcado, devuelve 404.
 *
 * @access Privado (requiere JWT Firebase)
 * @param {number} idusuario - ID del usuario.
 * @param {number} idelemento - ID del artista.
 *
 * @returns {void|ErrorResponseDTO}
 */
router.delete('/:idusuario/:idelemento/artista', verifyFirebaseToken, FavoritoController.deleteArt);


/**
 * @route GET /api/usuarios/favoritos/:idusuario/:idelemento/contenido
 * @description
 * Verifica si un contenido (canción o álbum) está marcado como favorito por el usuario.
 *
 * @access Privado (requiere JWT Firebase)
 * @param {number} idusuario - ID del usuario.
 * @param {number} idelemento - ID del contenido.
 *
 * @returns {boolean|ErrorResponseDTO}
 * Indica si el contenido está marcado como favorito.
 */
router.get('/:idusuario/:idelemento/contenido', verifyFirebaseToken, FavoritoController.existCont);


/**
 * @route DELETE /api/usuarios/favoritos/:idusuario/:idelemento/contenido
 * @description
 * Elimina un contenido (canción o álbum) de la lista de favoritos del usuario.
 * Si no estaba en favoritos devuelve 404.
 *
 * @access Privado (requiere JWT Firebase)
 * @param {number} idusuario - ID del usuario.
 * @param {number} idelemento - ID del contenido.
 *
 * @returns {void|ErrorResponseDTO}
 */
router.delete('/:idusuario/:idelemento/contenido', verifyFirebaseToken, FavoritoController.deleteCont);


/**
 * @route POST /api/usuarios/favoritos
 * @description
 * Añade un nuevo favorito para el usuario.
 * Soporta favoritos de artista (tipo 0), canción (tipo 1) o álbum (tipo 2).
 * Si ya existe devuelve 409. En caso de éxito responde con 201.
 *
 * @access Privado (requiere JWT Firebase)
 *
 * @body {idUsuario:number, idElemento:number, tipo:number}
 * - tipo = 0 → artista  
 * - tipo = 1 → canción  
 * - tipo = 2 → álbum  
 *
 * @returns {UsuarioFavoritoElementoDTO|ErrorResponseDTO}
 * Relación creada y cabecera Location con la URL del recurso.
 */
router.post('/', verifyFirebaseToken, FavoritoController.createFavorito);


export default router;
