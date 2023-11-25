/**
 * Interfaz con los datos que va a tener cada anuncio
 */
export interface Anuncio {
    id: number,
    marca: String,
    modelo: String,
    year: number,
    precio: number,
    img?: String
}
