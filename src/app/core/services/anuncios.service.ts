import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { async } from '@angular/core/testing';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Anuncio } from '../interfaces/anuncios';
import { AnunciosServiceInterface } from '../interfaces/anuncios-service-interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnunciosService implements AnunciosServiceInterface{
  private _anuncios: BehaviorSubject<Anuncio[]> = new BehaviorSubject<Anuncio[]>([]);
  anuncios$: Observable<Anuncio[]> = this._anuncios.asObservable();

  constructor(private http:HttpClient) {}

  getAllAnuncios(): Observable<Anuncio[]> {
    return this.http.get<Anuncio[]>(environment.URL_BASE+'anuncios').pipe(tap((anuncios:Anuncio[])=>{
      this._anuncios.next(anuncios);
    }))
  }
  getAnuncio(id:number):Observable<Anuncio>{
    return this.http.get<Anuncio>(environment.URL_BASE+`anuncios/${id}`);
  }
  addAnuncio(anun: Anuncio): Observable<Anuncio> {
    return this.http.post<Anuncio>(environment.URL_BASE + 'anuncios/', anun).pipe(
        tap((_) => {this.getAllAnuncios().subscribe();
        }
      )
    );
  }
  updateAnuncio(anun: Anuncio): Observable<Anuncio> {
    return new Observable<Anuncio>(observer=>{
      this.http.patch<Anuncio>(environment.URL_BASE+`anuncios/${anun.id}`, anun).subscribe(_=>{
        this.getAllAnuncios().subscribe(_=>{
          this.getAnuncio(anun.id).subscribe(_anun=>{
            observer.next(_anun);
          })
        })
      })
    })
  }

  delAnuncio(anun: Anuncio): Observable<Anuncio> {
    return this.http.delete<Anuncio>(environment.URL_BASE + `anuncios/${anun.id}`).pipe(
        tap(async (_) => {
          this.getAllAnuncios().subscribe();
        }
      )
    );
  }
}
