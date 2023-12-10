import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { async } from '@angular/core/testing';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { DataService } from './api/data.service';
import { MappingAnunciosService } from './api/mapping-anuncios.service';
import { PaginatedAnuncios, Anuncio } from '../interfaces/anuncios';
import { environment } from 'src/environments/environment';

export class AnuncioNotFoundException extends Error {
  // . declare any additional properties or methods .
}

interface CrudAnuncios {
  getAllAnuncios(userprop: number): Observable<PaginatedAnuncios>;
  addAnuncio(anun: Anuncio): Observable<Anuncio>;
  updateAnuncio(anun: Anuncio): Observable<Anuncio>;
  deleteAnuncio(anun: Anuncio): Observable<Anuncio>;
}

@Injectable({
  providedIn: 'root'
})
export class AnunciosService implements CrudAnuncios{
  private _anuncios:BehaviorSubject<PaginatedAnuncios> = new BehaviorSubject<PaginatedAnuncios>({data:[], pagination:{page:0,pageCount:0, pageSize:0, total:0}});
  public anuncios$:Observable<PaginatedAnuncios> = this._anuncios.asObservable();

  constructor(
    private http:HttpClient,
    private dataService:DataService,
    private mapping:MappingAnunciosService
  ) {}

  public addAnuncio(anuncio: Anuncio): Observable<Anuncio> {
    const endPoint = "anuncios";
    var _anun: any = {
        marca: anuncio.marca,
        modelo: anuncio.modelo,
        precio: anuncio.precio,
        year: anuncio.year,
        userprop: anuncio.userprop,
        img: anuncio.img
    }
    return this.dataService.post<Anuncio>(endPoint, _anun);
}

  public query(q: string): Observable<PaginatedAnuncios> {
    // Si coincide el tipo de datos que recibo con mi interfaz
    return this.dataService.query<any>('anuncios', {}).pipe(map(response => {
      return {
        data: response.data.map(anuncio => {
          return {
            id: anuncio.id,
            userprop: anuncio.userprop,
            marca: anuncio.marca,
            modelo: anuncio.modelo,
            year: new Date(anuncio.year),
            precio: anuncio.precio,
            img: anuncio.img
          };
        }),
        pagination: response.pagination
      };
    }));
  }

  public getAllAnuncios(): Observable<PaginatedAnuncios> {
    return this.dataService.query<any>(this.mapping.queryAnunciosUrl(), {}).pipe(map(response => {
      return this.mapping.mapAnuncios(response);
    }));
  }

  public getAnuncio(id:number):Observable<Anuncio>{
    return this.dataService.get<any>(this.mapping.getAnuncioUrl(id)).pipe(map(this.mapping.mapAnuncio.bind(this.mapping)));
  }

  public updateAnuncio(anuncio:Anuncio):Observable<Anuncio>{
    return this.dataService.put<any>(this.mapping.updateAnuncioUrl(anuncio.id!), anuncio).pipe(map(this.mapping.mapAnuncio.bind(this.mapping)));
  }

  public deleteAnuncio(anuncio:Anuncio):Observable<Anuncio>{
    return this.dataService.delete<any>(this.mapping.deleteAnuncioUrl(anuncio.id!)).pipe(map(this.mapping.mapAnuncio.bind(this.mapping)));
  }
}