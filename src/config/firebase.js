/**
 * @file firebase.js
 * @description Configuración e inicialización del SDK de Firebase Admin usando
 * credenciales definidas en variables de entorno. Este módulo expone una única
 * instancia de Firebase Admin para ser usada en cualquier parte del proyecto.
 *
 * Se utiliza `firebase-admin` (SDK de servidor), no el SDK de cliente. Esto permite:
 *  - Firmar y verificar tokens JWT de Firebase.
 *  - Gestionar usuarios y autenticación.
 *  - Acceder a servicios backend como Firestore, Realtime DB o Cloud Storage.
 *
 * Las credenciales se cargan desde variables de entorno para evitar exponer
 * información sensible en el repositorio. La clave privada requiere reemplazar
 * manualmente los saltos de línea escapados.
 *
 * @example
 * import { firebaseAdmin } from "../config/firebase.js";
 * 
 * const decoded = await firebaseAdmin.auth().verifyIdToken(token);
 *
 * @requires firebase-admin
 * @requires dotenv
 */
import dotenv from "dotenv";
dotenv.config();

import admin from "firebase-admin";//Trabajaremos con la libreria de firebase-admin, no la parte de cliente

if (!admin.apps.length) {
  admin.initializeApp({ //crea el objeto firebase-service-account con los datos del .env asi es mas privado
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replaceAll('\\n', '\n'),
    }),
  });
}

export const firebaseAdmin = admin;
