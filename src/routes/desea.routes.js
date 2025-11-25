/**
 * @file desea.routes.js
 * @description Define las rutas relacionadas con la lista de deseos del usuario.
 * Todas las rutas requieren autenticación mediante Firebase JWT.
 */
import { Router } from 'express';
import { verifyFirebaseToken } from "../middlewares/authJWTFirebase.js";
import { DeseaController } from '../controllers/desea.controller.js';

const router = Router();

/**
 * @route GET /api/usuarios/desea/:idusuario
 * @description Devuelve una lista de los elementos que el usuario ha marcado como deseados.
 * @access Privado (requiere JWT Firebase)
 * @param {string} idusuario - ID del usuario.
 * @returns {Array<ElementoDTO>|ErrorResponseDTO} Lista de deseados del usuario.
 */
router.get('/:idusuario', verifyFirebaseToken, DeseaController.getDeseadosByUser);  //Endoint privado

/**
 * @route GET /api/usuarios/desea/:idusuario/:idelemento
 * @description Comprueba si el usuario ha marcado un elemento como deseado.
 * @access Privado (requiere JWT Firebase)
 * @param {string} idusuario - ID del usuario.
 * @param {string} idelemento - ID del elemento.
 * @returns {Boolean|ErrorResponseDTO} Indica si existe o no el registro.
 */
router.get('/:idusuario/:idelemento', verifyFirebaseToken, DeseaController.existDeseado);  //Endoint privado

/**
 * @route DELETE /api/usuarios/desea/:idusuario/:idelemento
 * @description Quita un elemento de la lista de deseos del usuario.
 * @access Privado (requiere JWT Firebase)
 * @param {string} idusuario - ID del usuario.
 * @param {string} idelemento - ID del elemento.
 * @returns {void|ErrorResponseDTO} Si el correcto no devuelve nada.
 */
router.delete('/:idusuario/:idelemento', verifyFirebaseToken, DeseaController.deleteDeseado);  //Endoint privado

/**
 * @route POST /api/usuarios/desea/
 * @description Añadir un nuevo elemento a la lista de deseados del usuario.
 * @access Privado (requiere JWT Firebase)
 * @body {idusuario:number, idelemento:number} Datos necesarios para añadir un deseado.
 * @returns {UsuarioDeseaElementoDTO|ErrorResponseDTO} Relacion creada.
 */
router.post('/', verifyFirebaseToken, DeseaController.createDeseado);  //Endoint privado

export default router;