/**
 * @file script/getToken.js
 * @description Script CLI para obtener un `idToken` JWT de Firebase Authentication
 * utilizando un email y contraseña.  
 *
 * Este script usa la API REST de Identity Toolkit para simular un login
 * (`signInWithPassword`) y recuperar:
 *  - idToken (JWT válido para autenticación)
 *  - refreshToken
 *  - uid del usuario (`localId`)
 *  - tiempo de expiración del token
 *
 * Se usa únicamente en entorno de desarrollo para probar autenticación
 * contra el backend que valida tokens con Firebase Admin.
 *
 * Requiere definir en `.env` la variable `FIREBASE_API_KEY`.
 *
 * @usage
 * ```bash
 * node script/getToken.js <email> <password>
 * ```
 *
 * @example
 * node script/getToken.js usuario@correo.com 123456
 * 
 * @requires node >= 18 (fetch nativo)
 * @requires dotenv
 */
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.FIREBASE_API_KEY;
if (!API_KEY) {
  console.error("ERROR: define FIREBASE_API_KEY en .env (la API key del proyecto Firebase).");
  process.exit(1);
}

/**
 * Realiza una llamada HTTP a Firebase Authentication para iniciar sesión
 * con email y contraseña.
 *
 * @async
 * @function signInWithEmailAndPassword
 *
 * @param {string} email - Email registrado en Firebase Auth.
 * @param {string} password - Contraseña asociada al usuario.
 *
 * @returns {Promise<object>} Respuesta completa de Firebase:
 * ```ts
 * {
 *   idToken: string,
 *   refreshToken: string,
 *   expiresIn: string,
 *   localId: string,
 *   registered: boolean
 * }
 * ```
 *
 * @throws {Error} Si Firebase devuelve un error o las credenciales no son válidas.
 */
async function signInWithEmailAndPassword(email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });

  const body = await resp.json();

  if (!resp.ok) {
    const message = body?.error?.message || JSON.stringify(body);
    throw new Error(`Firebase signIn error: ${message}`);
  }

  return body;
}

async function main() {
  const [,, email, password] = process.argv;

  if (!email || !password) {
    console.log("Uso: node script/getToken.js <email> <password>");
    process.exit(1);
  }

  try {
    const result = await signInWithEmailAndPassword(email, password);
    console.log("✅ Token obtenido con éxito:");
    console.log("idToken:", result.idToken);
    console.log("refreshToken:", result.refreshToken);
    console.log("uid:", result.localId);
    console.log("expiresIn:", result.expiresIn);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

main();
