import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { async } from '@angular/core/testing';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { DataService } from './api/data.service';
import { MappingService } from './api/mapping.service';
import { PaginatedAnuncios, Anuncio } from '../interfaces/anuncios';
import { AnunciosServiceInterface } from '../interfaces/anuncios-service-interface';
import { environment } from 'src/environments/environment';

export class AnuncioNotFoundException extends Error {
  // . declare any additional properties or methods .
}

@Injectable({
  providedIn: 'root'
})
export class AnunciosService implements AnunciosServiceInterface{
  private _anuncios:BehaviorSubject<PaginatedAnuncios> = new BehaviorSubject<PaginatedAnuncios>({data:[], pagination:{page:0,pageCount:0, pageSize:0, total:0}});
  public anuncios$:Observable<PaginatedAnuncios> = this._anuncios.asObservable();

  constructor(
    private http:HttpClient,
    private dataService:DataService,
    private mapping:MappingService
  ) {}
/*
  public addAnuncio(anuncio:Anuncio):Observable<Anuncio>{
    return this.dataService.post<Anuncio>("anuncio", anuncio).pipe(tap(_=>{
      this.getAllAnuncios().subscribe();
    }))
  }

  public query(q: string): Observable<PaginatedAnuncios> {
    // Si coincide el tipo de datos que recibo con mi interfaz
    return this.dataService.query<any>('anuncios', {}).pipe(map(response => {
      return {
        data: response.data.map(anuncio => {
          return {
            id: anuncio.id,
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

  public delAnuncio(anuncio:Anuncio):Observable<Anuncio>{
    return this.dataService.delete<any>(this.mapping.deleteAnuncioUrl(anuncio.id!)).pipe(map(this.mapping.mapAnuncio.bind(this.mapping)));
  } */
}