/**
 * @file authJWTFirebase.js
 * @description Middleware para validar tokens JWT emitidos por Firebase.
 * Verifica el token, decodifica el usuario y asegura que el ID del token coincida
 * con el ID recibido en la URL o en el body (si aplica).
 */
import { firebaseAdmin } from "../config/firebase.js";
import { ErrorResponseDTO } from "../dto/errorResponse.dto.js";

/**
 * @function verifyFirebaseToken
 * @description Middleware que valida el token Bearer enviado por el cliente.
 * - Comprueba si existe el header Authorization.
 * - Valida y decodifica el token con Firebase Admin.
 * - Inserta la información del usuario autenticado en `req.user`.
 * - Si existe un parámetro ID (id, idusuario o idusuario en el body), comprueba que coincide con el UID del token.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns {Response|void}
 */
export const verifyFirebaseToken = async (req,res,next) => {
  try {
    //Devuelve la autentificacion del header, se busca el Bearer
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {//Si no esta ya lo tiene prohibido
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];//Tomamos solo el token (Quitamos el Bearer )
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token); //Verifica el token y lo decodifica
    //console.log(decodedToken);
    (req).user = decodedToken; // guarda los datos del usuario en req.user

    // Comprobar si hay un parámetro "id" o "idusuario"
    const idParam = req.params?.id || req.params?.idusuario || req.body?.idusuario ;
    if (idParam) {
      if (String(idParam) !== String(decodedToken.uid)) {
        return res.status(403).json(
          new ErrorResponseDTO({
            code: 403,
            message: "Acceso denegado: el ID del parámetro no coincide con el usuario autenticado",
            path: req.originalUrl
          })
        );
      }
    }


    next(); // MUY IMPORTANTE: DEJA A QUE LLEGUE EL ENDPOINT
  } catch (error) { //Cualquier error sera PROHIBIDO
    console.error("Error al verificar token:", error);
    return res.status(401).json(
      new ErrorResponseDTO({
        code: 401,
        message: "Token inválido o expirado",
        path: req.originalUrl
      })
    );
  }
};
