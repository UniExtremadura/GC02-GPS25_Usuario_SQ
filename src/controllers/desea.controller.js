/**
 * @file desea.controller.js
 * @description Controlador para la gestión de la lista de deseos del usuario.
 * Se encarga de exponer los endpoints definidos en la capa de rutas y delega la
 * lógica de negocio en el DeseaService.
 */
import { DeseaService } from '../services/desea.service.js';
import { ErrorResponseDTO } from '../dto/errorResponse.dto.js'

export const DeseaController = {

  /**
   * Obtiene todos los elementos deseados de un usuario.
   *
   * @async
   * @function getDeseadosByUser
   * @route GET /desea/:idUsuario
   * @description Devuelve una lista de elementos deseados por un usuario.  
   * Requiere que el servicio de contenidos complete la información de cada elemento.
   *
   * @param {import('express').Request} req - Petición HTTP.
   * @param {import('express').Response} res - Respuesta HTTP.
   *
   * @returns {Promise<Array<ElementoDTO>|ErrorResponseDTO>}
   *
   * @response 200 - Lista de elementos deseados del usuario.
   * @response 401 - Token inválido o no autorizado (middleware previo).
   * @response 403 - ID del parámetro no coincide con el usuario autenticado (middleware previo).
   * @response 500 - Error interno del servidor.
   */
  async getDeseadosByUser(req, res) {
    try {
      const idusuario = parseInt(req.params.idusuario);
      const data = await DeseaService.getDeseadosByUser(idusuario);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      
      if (error instanceof ErrorResponseDTO) {
        return res.status(error.code).json(error);
      }
      res.status(500).json(
        new ErrorResponseDTO({
          code: 500,
          message: `Error interno al consultar los elementos deseados del usuario.`,
          path: req.originalUrl,
        })
      );
    }
  },

  /**
   * Verifica si un elemento está en la lista de deseos del usuario.
   *
   * @async
   * @function existDeseado
   * @route GET /desea/:idUsuario/:idElemento
   *
   * @description Comprueba si un usuario ha marcado un elemento como deseado.
   *
   * @param {import('express').Request} req - Petición HTTP.
   * @param {import('express').Response} res - Respuesta HTTP.
   *
   * @returns {Promise<boolean|ErrorResponseDTO>}
   *
   * @response 200 - Devuelve `true` o `false`.
   * @response 401 - Token inválido o no autorizado (middleware previo).
   * @response 403 - ID del parámetro no coincide con el usuario autenticado (middleware previo).
   * @response 500 - Error interno al verificar la existencia del deseado.
   */
  async existDeseado(req, res) {
    try {
      const idusuario = parseInt(req.params.idusuario);
      const idelemento = parseInt(req.params.idelemento);
      const data = await DeseaService.existDeseado(idusuario, idelemento);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      
      if (error instanceof ErrorResponseDTO) {
        return res.status(error.code).json(error);
      }
      res.status(500).json(
        new ErrorResponseDTO({
          code: 500,
          message: `Error interno del servidor al verificar el estado del elemento.`,
          path: req.originalUrl,
        })
      );
    }
  },

    /**
   * Elimina un elemento de la lista de deseos del usuario.
   *
   * @async
   * @function deleteDeseado
   * @route DELETE /desea/:idUsuario/:idElemento
   *
   * @description Elimina la relación si existe.  
   * Si se elimina correctamente → 204 (sin contenido).
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   *
   * @returns {Promise<void|ErrorResponseDTO>}
   *
   * @response 204 - Eliminado correctamente (sin contenido).
   * @response 401 - Token inválido o no autorizado (middleware previo).
   * @response 403 - ID del parámetro no coincide con el usuario autenticado (middleware previo).
   * @response 404 - Relación inexistente.
   * @response 500 - Error interno al eliminar el deseado.
   */
  async deleteDeseado(req, res) {
    try {
      const idusuario = parseInt(req.params.idusuario);
      const idelemento = parseInt(req.params.idelemento);
      const deleted = await DeseaService.deleteDeseado(idusuario, idelemento);
      if (!deleted) {
        return res.status(404).json(
          new ErrorResponseDTO({
            code: 404,
            message: `Elemento o usuario no encontrado en la lista de deseos.`,
            path: req.originalUrl,
          })
        );
      }

      res.status(204).end();
    } catch (error) {
      console.error(error);
      
      if (error instanceof ErrorResponseDTO) {
        return res.status(error.code).json(error);
      }
      res.status(500).json(
        new ErrorResponseDTO({
          code: 500,
          message: `Error interno del servidor al eliminar el elemento deseado.`,
          path: req.originalUrl,
        })
      );
    }
  },

  /**
   * Crea una nueva relación en la lista de deseos del usuario.
   *
   * @async
   * @function createDeseado
   * @route POST /desea
   *
   * @description Inserta un elemento en la lista de deseados.  
   * Si ya existe → 409 conflicto.
   *
   * @param {import('express').Request} req - Cuerpo: { idUsuario, idElemento, tipo }
   * @param {import('express').Response} res
   *
   * @returns {Promise<UsuarioDeseaElementoDTO|ErrorResponseDTO>}
   *
   * @response 201 - Elemento añadido a la lista de deseados.
   * @response 400 - Datos incompletos o inválidos.
   * @response 401 - Token inválido o no autorizado (middleware previo).
   * @response 403 - ID del parámetro no coincide con el usuario autenticado (middleware previo).
   * @response 404 - Elemento o usuario inexistente.
   * @response 409 - El elemento ya estaba en la lista.
   * @response 500 - Error interno del servidor.
   */
  async createDeseado(req, res) {
    try {

      const { idusuario, idelemento } = req.body;
      // Control básico previo (Swagger indica error 400)
      if (!idusuario || !idelemento ) {
        return res.status(400).json(
          new ErrorResponseDTO({
            code: 400,
            message: "Solicitud inválida o datos incompletos",
            path: req.originalUrl,
          })
        );
      }

      const data = await DeseaService.createDeseado(req.body);
      res.status(201)
        .location(`/api/usuarios/desea/${idusuario}/${idelemento}`)
        .json(data);
    } catch (error) {
      console.error(error);
      
      if (error instanceof ErrorResponseDTO) {
        return res.status(error.code).json(error);
      }

      res.status(500).json(
        new ErrorResponseDTO({
          code: 500,
          message: `Error interno del servidor al crear el elemento deseado.`,
          path: req.originalUrl,
        })
      );
    }
  },

};
