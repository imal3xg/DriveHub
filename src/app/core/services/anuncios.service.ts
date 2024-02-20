import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, catchError, map, tap, throwError } from 'rxjs';
import { DataService } from './api/data.service';
import { MappingAnunciosService } from './api/mapping-anuncios.service';
import { PaginatedAnuncios, Anuncio } from '../interfaces/anuncios';

export class AnuncioNotFoundException extends Error {
  // . declare any additional properties or methods .
}

interface CrudAnuncios {
  getAllAnuncios(): Observable<PaginatedAnuncios>;
  addAnuncio(anun: Anuncio): Observable<Anuncio>;
  updateAnuncio(anun: Anuncio): Observable<Anuncio>;
  deleteAnuncio(anuncioId: number): Observable<void>;
}

@Injectable({
  providedIn: 'root'
})
export class AnunciosService implements CrudAnuncios {
  private _anuncios: BehaviorSubject<PaginatedAnuncios> = new BehaviorSubject<PaginatedAnuncios>({ data: [], pagination: { page: 0, pageCount: 0, pageSize: 0, total: 0 } });
  public anuncios$: Observable<PaginatedAnuncios> = this._anuncios.asObservable();

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private mapping: MappingAnunciosService
  ) { }

  public query(q: string): Observable<PaginatedAnuncios> {
    // Si coincide el tipo de datos que recibo con mi interfaz
    const apiUrl = "anuncios?populate=imgs";
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
            imgs: anuncio.imgs ? anuncio.imgs.data.attributes.formats.medium.url:null
          };
        }),
        pagination: response.pagination
      };
    }));
  }

  public getAllAnuncios(): Observable<PaginatedAnuncios> {
    const apiUrl = "anuncios?sort=publishedAt:desc&populate=imgs";
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
            imgs: anuncio.imgs ? anuncio.imgs.data.attributes.formats.medium.url:null
          };
        }),
        pagination: response.pagination
      };
    }));
  }

  public getAllUserAnuncios(userId: number): Observable < PaginatedAnuncios > {
    const apiUrl = "anuncios?sort=publishedAt:desc&populate=imgs&filters[users_permissions_user]=" + userId;
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
            imgs: anuncio.imgs ? anuncio.imgs.data.attributes.formats.medium.url:null
          };
        }),
        pagination: response.pagination
      };
    }));
  }
  
  public getAnuncio(id: number): Observable < Anuncio > {
    return this.dataService.get<any>(this.mapping.getAnuncioUrl(id)).pipe(map(this.mapping.mapAnuncio.bind(this.mapping)));
  }

  getAnuncioId(anuncio: Anuncio): number | null {
    return anuncio ? anuncio.id : null;
  }
  
  public addAnuncio(anuncio: Anuncio): Observable < Anuncio > {
    const apiUrl = "anuncios";
    var _anun: any = {
      users_permissions_user: anuncio.userId,
      marca: anuncio.marca,
      modelo: anuncio.modelo,
      precio: anuncio.precio,
      year: anuncio.year,
      imgs: anuncio.imgs
    };
    return this.dataService.post<Anuncio>(apiUrl, _anun).pipe(tap(_ => {
      this.getAllUserAnuncios(anuncio.userId).subscribe();
    }))
  }

  public updateAnuncio(anuncio: Anuncio): Observable < Anuncio > {
    const anuncioId = this.getAnuncioId(anuncio);
    if(!anuncioId) {
      console.error('El anuncio no tiene un ID válido.');
      return EMPTY;
    }
      var _anun: any = {
      users_permissions_user: anuncio.userId,
      marca: anuncio.marca,
      modelo: anuncio.modelo,
      precio: anuncio.precio,
      year: anuncio.year,
      imgs: anuncio.imgs
    };
    const apiUrl = `anuncios/${anuncioId}`;
    return this.dataService.put<Anuncio>(apiUrl, _anun).pipe(tap(_ => {
        this.getAllUserAnuncios(anuncio.userId).subscribe();
      }),
      catchError(error => {
        console.error('Error al actualizar el anuncio:', error);
        return throwError(error);
      })
    );
  }

  public deleteAnuncio(anuncioId: number): Observable < void> {
    if(!anuncioId) {
      console.error('El ID del anuncio no es válido.');
      return EMPTY;
    }
      const apiUrl = `anuncios/${anuncioId}`;
    return this.dataService.delete<void>(apiUrl).pipe(
      tap(_ => {
        console.log('Anuncio eliminado con éxito.');
      }),
      catchError(error => {
        console.error('Error al eliminar el anuncio:', error);
        return throwError(error);
      })
    );
  }
}