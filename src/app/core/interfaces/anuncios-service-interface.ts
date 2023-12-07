import { Observable } from "rxjs";
import { Anuncio, PaginatedAnuncios } from "./anuncios";

export interface AnunciosServiceInterface {
    /**
     * Obtiene todos los anuncios de la lista
     * @returns Observable de toda la lista de anuncios
     */
    //getAllAnuncios():Observable<PaginatedAnuncios>;
    /**
     * Obtiene un anuncio de la lista
     * @returns Observable del anuncio obtenido
     */
    //getAnuncio(id:number):Observable<Anuncio>;
    /**
     * Añade un anuncio a la lista del servicio de anuncios 
     * @returns Observable del anuncio añadido
     */
    //addAnuncio(anun:Anuncio):Observable<Anuncio>;
    /**
     * Borra un anuncio de la lista del servicio de anuncios
     * @returns Observable del anuncio borrado
     */
    //delAnuncio(anun:Anuncio):Observable<Anuncio>;
    /**
     * Actualiza los datos de un anuncio
     * @returns Observable del anuncio actualizado
     */
    //updateAnuncio(anun:Anuncio):Observable<Anuncio>;
}