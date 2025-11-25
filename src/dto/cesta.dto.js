/**
 * @file cesta.dto.js
 * @description DTOs para representar la cesta del usuario y los elementos dentro de ella.
 */

/**
 * Representa un elemento individual dentro de la cesta.
 *
 * @class CestaItemDTO
 *
 * @property {number} idelemento - ID del elemento.
 * @property {string} nombre - Nombre del elemento.
 * @property {number} precio - Precio unitario del elemento.
 * @property {string|null} rutaimagen - Ruta o URL de la imagen del elemento.
 * @property {number} tipo - Tipo de elemento (0 = artista, 1 = canción, 2 = álbum, etc.).
 */
export class CestaItemDTO {
  constructor({ idelemento, nombre, precio, rutaimagen = null, tipo }) {
    this.idelemento = idelemento;
    this.nombre = nombre;
    this.precio = precio;
    this.rutaimagen = rutaimagen;
    this.tipo = tipo;
  }
}

/**
 * Representa la cesta completa de un usuario, incluyendo
 * la lista de items y el total calculado.
 *
 * @class CestaDTO
 *
 * @property {CestaItemDTO[]} items - Lista de elementos en la cesta.
 * @property {number} total - Suma total de los precios de los items.
 *
 * @example
 * const cesta = new CestaDTO({
 *   items: [
 *     { idelemento: 3, nombre: "Álbum X", precio: 9.99, rutaimagen: "/img/3.png", tipo: 2 },
 *     { idelemento: 10, nombre: "Canción Y", precio: 1.29, rutaimagen: "/img/10.png", tipo: 1 }
 *   ]
 * });
 *
 * console.log(cesta.total); // 11.28
 */
export class CestaDTO {
  constructor({ items = [] }) {
    this.items = items.map((i) => new CestaItemDTO(i));

    this.total = parseFloat(
      this.items
        .reduce((acc, item) => acc + (Number(item.precio) || 0), 0)
        .toFixed(2)
    );
  }
}
