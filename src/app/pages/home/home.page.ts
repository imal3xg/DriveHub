import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Anuncio } from 'src/app/core/interfaces/anuncios';
import { BehaviorSubject, zip } from 'rxjs';
import { ModalController, ToastController, ToastOptions } from '@ionic/angular';
import { AnunciosService } from 'src/app/core/services/anuncios.service';
import { Pagination } from 'src/app/core/interfaces/data';
import { AuthService } from 'src/app/core/services/api/auth.service';
import { AnuncioDetailComponent } from 'src/app/shared/components/anuncio-detail/anuncio-detail.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  // BehaviorSubject para los anuncios y su observable
  private _anuns = new BehaviorSubject<Anuncio[]>([]);
  public anuns$ = this._anuns.asObservable();

  // BehaviorSubject para la paginación y su observable
  public _pagination = new BehaviorSubject<Pagination>({ page: 0, pageSize: 0, pageCount: 0, total: 0 });
  private pagination$ = this._pagination.asObservable();

  constructor(
    public auth: AuthService,
    public anuns: AnunciosService,
    private modal: ModalController
  ) { }

  // Método para cargar los anuncios
  private loadAnun(page: number = 0, refresher: any = null) {
    this.anuns.query("").subscribe({
      next: response => {
        // Actualizar la lista de anuncios y la paginación con la respuesta del servicio
        this._anuns.next(response.data);
        this._pagination.next(response.pagination);
        // Completar el refrescado si se proporcionó un refresher
        if (refresher) refresher.target.complete();
        // Recargar la página después de un tiempo
        setTimeout(() => {
          location.reload();
        });
      },
      error: err => {
        console.log(err);
        // Completar el refrescado si se proporcionó un refresher
        if (refresher) refresher.target.complete();
        // Recargar la página después de un tiempo
        setTimeout(() => {
          location.reload();
        });
      }
    });
  }

  ngOnInit(): void {
    // Suscribirse al usuario autenticado y cargar los anuncios si hay un usuario válido
    this.auth.user$.subscribe(user => {
      if (user?.id) {
        this.getAnuncios(user.id);
      }
    })
  }

  // Método para obtener los anuncios de un usuario dado su ID
  private getAnuncios(userId: number) {
    this.anuns.getAllAnuncios(userId).subscribe({
      next: response => {
        // Actualizar la lista de anuncios y la paginación con la respuesta del servicio
        this._anuns.next(response.data);
        this._pagination.next(response.pagination);
      },
      error: err => {
        console.log('Error al obtener los anuncios:', err);
      }
    });
  }

  // Método para manejar el evento de refrescado de la página
  doRefresh(event: any) {
    this.loadAnun(0, event.target);
  }

  // Método para manejar el evento de clic en una tarjeta de anuncio
  public async onCardClicked(anun: Anuncio) {
    // Función que se ejecutará al cerrarse el modal
    var onDismiss = (info: any) => { }
    // Presentar el formulario de detalle del anuncio en un modal
    this.presentForm(anun, onDismiss);
  }

  // Método para presentar el formulario de detalle del anuncio en un modal
  async presentForm(data: Anuncio | null, onDismiss: (result: any) => void) {
    const modal = await this.modal.create({
      component: AnuncioDetailComponent,
      componentProps: {
        anun: data
      },
      cssClass: "modal-full-right-side"
    });
    modal.present();
    // Manejar el evento cuando el modal se cierra
    modal.onDidDismiss().then(result => {
      // Ejecutar la función de descarte si hay datos en el resultado
      if (result && result.data) {
        onDismiss(result);
      }
    });
  }
}
