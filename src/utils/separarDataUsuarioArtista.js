/**
 * @file separarDataUsuarioArtista.js
 * @description Utilidad para dividir datos combinados de usuario/artista en dos objetos separados.
 *
 * Esta función se utiliza cuando un endpoint recibe un cuerpo con información mixta
 * perteneciente tanto al modelo `usuario` como al modelo `artista`.  
 * La función toma ese objeto y lo separa en dos estructuras independientes,
 * respetando los campos válidos para cada entidad.
 *
 * También contempla casos especiales, como la llegada de un objeto `genero`,
 * convirtiéndolo automáticamente a `idgenero` para la tabla artista.
 *
 * @function separarDataUsuarioArtista
 *
 * @param {Object} data - Datos recibidos desde el cliente, conteniendo campos
 *                        de usuario, artista o ambos.
 * @param {boolean} [esArtistaActual=false] - Indica si el usuario ya es artista.
 *                                            Si es false, no se devuelve información de artista.
 *
 * @returns {[Object, Object|null]}  
 * - `usuarioData`: Objeto con solo los campos válidos para `usuario`.  
 * - `artistaData`: Objeto con los campos válidos para `artista`,
 *                  o `null` si el usuario no es artista.
 *
 * @example
 * // Entrada:
 * separarDataUsuarioArtista({
 *   nombreusuario: "juan23",
 *   correo: "juan@example.com",
 *   descripcion: "me encanta la música",
 *   esnovedad: true,
 *   oyentes: 1500,
 *   genero: { id: 3 }
 * }, true);
 *
 * // Salida:
 * [
 *   { nombreusuario: "juan23", correo: "juan@example.com", descripcion: "me encanta la música" },
 *   { esnovedad: true, oyentes: 1500, idgenero: 3 }
 * ]
 */
export function separarDataUsuarioArtista(data, esArtistaActual = false) {
  // usuario
  const usuarioFields = [
    "nombreusuario",
    "nombrereal",
    "contrasenia",
    "correo",
    "descripcion",
    "fecharegistro",
    "rutafoto",
    "esartista"
  ];

  // artista
  const artistaFields = [
    "esnovedad",
    "oyentes",
    "valoracion",
    "idgenero",   
  ];

  const usuarioData = {};
  const artistaData = {};

  for (const key in data) {
    if (usuarioFields.includes(key)) {
      usuarioData[key] = data[key];
    } 
    else if (artistaFields.includes(key)) {
      artistaData[key] = data[key];
    }
  }

  // Si viene un objeto genero, lo transformamos a idgenero
  if (data.genero?.id) {
    artistaData.idgenero = data.genero.id;
  }

  // Si no es artista, no hay artistaData
  if (!esArtistaActual) {
    return [usuarioData, null];
  }

  return [usuarioData, artistaData];
}
