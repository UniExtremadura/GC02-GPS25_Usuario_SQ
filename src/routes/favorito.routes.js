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
