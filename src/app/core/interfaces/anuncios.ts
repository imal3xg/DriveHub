import { PaginatedData } from "./data"

/**
 * Interfaz con los datos que va a tener cada anuncio
 */
export interface Anuncio {
    id: number,
    marca: String,
    modelo: String,
    year: Date,
    precio: number,
    img?: String
}

export type PaginatedAnuncios = PaginatedData<Anuncio>