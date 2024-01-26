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
  getAllAnuncios(userId: number): Observable<PaginatedAnuncios>;
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

  public query(q: string): Observable<PaginatedAnuncios> {
    // Si coincide el tipo de datos que recibo con mi interfaz
    return this.dataService.query<any>('anuncios', {}).pipe(map(response => {
      return {
        data: response.data.map(anuncio => {
          return {
            id: anuncio.id,
            userId: anuncio.userId,
            marca: anuncio.marca,
            modelo: anuncio.modelo,
            precio: anuncio.precio,
            year: anuncio.year,
            img: anuncio.img
          };
        }),
        pagination: response.pagination
      };
    }));
  }

  public getAllAnuncios(userId: number): Observable<PaginatedAnuncios> {
    const apiUrl = "anuncios?sort=publishedAt:desc&populate=users_permissions_user";
    return this.dataService.query<any>(apiUrl, {}).pipe(map(response => {
      return {
        data: response.data.map(anuncio => {
          return {
            id: anuncio.id,
            userId: anuncio.userId,
            marca: anuncio.marca,
            modelo: anuncio.modelo,
            precio: anuncio.precio,
            year: anuncio.year,
            img: anuncio.img
          };
        }),
        pagination: response.pagination
      };
    }));
  }

  public getAllUserAnuncios(userId: number): Observable<PaginatedAnuncios> {
    const apiUrl = "anuncios?sort=publishedAt:desc&populate=users_permissions_user&filters[users_permissions_user]=" + userId;
    return this.dataService.query<any>(apiUrl, {}).pipe(map(response => {
      return {
        data: response.data.map(anuncio => {
          return {
            id: anuncio.id,
            userId: anuncio.userId,
            marca: anuncio.marca,
            modelo: anuncio.modelo,
            precio: anuncio.precio,
            year: anuncio.year,
            img: anuncio.img
          };
        }),
        pagination: response.pagination
      };
    }));
  }
  
  public getAnuncio(id:number): Observable<Anuncio> {
    return this.dataService.get<any>(this.mapping.getAnuncioUrl(id)).pipe(map(this.mapping.mapAnuncio.bind(this.mapping)));
  }

  public addAnuncio(anuncio: Anuncio): Observable<Anuncio> {
    const apiUrl = "anuncios";
    var _anun: any = {
      userId: anuncio.userId,
      marca: anuncio.marca,
      modelo: anuncio.modelo,
      precio: anuncio.precio,
      year: anuncio.year,
      img: anuncio.img
    };
    return this.dataService.post<Anuncio>(apiUrl, _anun).pipe(tap(_=>{
      this.getAllUserAnuncios(anuncio.userId).subscribe();
    }))
  }
  
  public updateAnuncio(anuncio:Anuncio): Observable<Anuncio> {
    const apiUrl = "anuncios";
    var _anun: any = {
      marca: anuncio.marca,
      modelo: anuncio.modelo,
      precio: anuncio.precio,
      year: anuncio.year,
      img: anuncio.img
    };
    return this.http.patch<Anuncio>(apiUrl, _anun).pipe(tap(_=>{
      this.getAllUserAnuncios(anuncio.userId).subscribe();
    }))
  }

  public deleteAnuncio(anuncio:Anuncio): Observable<Anuncio> {
    const apiUrl = "anuncios/" + anuncio.id;
    return this.dataService.delete<Anuncio>(apiUrl).pipe(tap(_=> {
      this.getAllUserAnuncios(anuncio.userId).subscribe();
    }))
  }
}