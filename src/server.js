/**
 * @file server.js
 * @description Punto de entrada principal del servidor. 
 * Se encarga de iniciar la aplicación Express y escuchar peticiones 
 * en el puerto definido en las variables de entorno o el puerto 3000 por defecto.
 */

import app from './app.js';

const PORT = process.env.PORT || 3000;

/**
 * Inicia el servidor HTTP.
 * 
 * @function listen
 * @description Levanta el servidor Express en el puerto especificado.
 *
 * @returns {void}
 *
 * @example
 * // Iniciar servidor
 * node server.js
 * npm run dev
 * npm start
 *
 * @console
 * Muestra un mensaje indicando la URL donde está corriendo el servidor.
 */
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación:  http://localhost:${PORT}/api/docs`);
});
