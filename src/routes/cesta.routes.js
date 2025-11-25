/**
 * @file cesta.routes.js
 * @description Define las rutas relacionadas con la cesta del usuario.
 * Todas las rutas requieren autenticación mediante Firebase JWT.
 */

import { Router } from 'express';
import { verifyFirebaseToken } from "../middlewares/authJWTFirebase.js";
import { CestaController } from '../controllers/cesta.controller.js';

const router = Router();

/**
 * @route POST /api/usuarios/cesta
 * @description
 * Añade un nuevo elemento a la cesta del usuario.  
 * Si el elemento ya existe se devuelve un error 409.  
 * En caso de éxito responde con 201 y la URL del recurso creado.
 *
 * @access Privado (requiere JWT Firebase)
 * 
 * @body {idUsuario:number, idElemento:number, tipo:number}
 * Datos necesarios para registrar la relación en la cesta.
 * 
 * @returns {UsuarioCestaElementoDTO|ErrorResponseDTO}
 * Devuelve la relación creada o un error.
 */
router.post('/', verifyFirebaseToken, CestaController.createItemCesta);


/**
 * @route DELETE /api/usuarios/cesta/:idusuario/:idelemento
 * @description
 * Elimina un elemento de la cesta del usuario.  
 * Si no existe, devuelve 404.  
 * Si se elimina correctamente, responde con 204 sin contenido.
 *
 * @access Privado (requiere JWT Firebase)
 * @param {number} idusuario - ID del usuario.
 * @param {number} idelemento - ID del elemento a eliminar.
 *
 * @returns {void|ErrorResponseDTO}
 */
router.delete('/:idusuario/:idelemento', verifyFirebaseToken, CestaController.deleteItemCesta);


export default router;
