import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, ToastOptions } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Pagination } from 'src/app/core/interfaces/data';
import { AuthService } from 'src/app/core/services/api/auth.service';
import { AnunciosService } from 'src/app/core/services/anuncios.service';
import { Anuncio } from 'src/app/core/interfaces/anuncios';
import { AnuncioPerfilDetailComponent } from 'src/app/shared/components/anuncio-perfil-detail/anuncio-perfil-detail.component';
import { AnuncioFormComponent } from 'src/app/shared/components/anuncio-form/anuncio-form.component';
import { dataURLtoBlob } from 'src/app/core/helpers/blob';
import { MediaService } from 'src/app/core/services/api/media.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  // BehaviorSubject para los anuncios del usuario y su observable
  private _misanuns = new BehaviorSubject<Anuncio[]>([]);
  public anuns$ = this._misanuns.asObservable();

  // BehaviorSubject para la paginación y su observable
  public _pagination = new BehaviorSubject<Pagination>({ page: 0, pageSize: 0, pageCount: 0, total: 0 });
  private pagination$ = this._pagination.asObservable();

  constructor(
    private toast: ToastController,
    public auth: AuthService,
    public misanuns: AnunciosService,
    private modal: ModalController,
    private media: MediaService
  ) { }

  // Método para cargar los anuncios del usuario
  private loadMisanun(page: number = 0, refresher: any = null) {
    this.misanuns.query("").subscribe({
      next: response => {
        // Actualizar la lista de anuncios del usuario y la paginación con la respuesta del servicio
        this._misanuns.next(response.data);
        this._pagination.next(response.pagination);
        // Completar el refrescado si se proporcionó un refresher
        if (refresher) refresher.complete();
        // Recargar la página después de un tiempo
        setTimeout(() => {
          location.reload();
        });
      },
      error: err => {
        console.log(err);
        // Completar el refrescado si se proporcionó un refresher
        if (refresher) refresher.complete();
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

  // Método para obtener los anuncios del usuario dado su ID
  private getAnuncios(userId: number) {
    this.misanuns.getAllUserAnuncios(userId).subscribe({
      next: response => {
        // Actualizar la lista de anuncios del usuario y la paginación con la respuesta del servicio
        this._misanuns.next(response.data);
        this._pagination.next(response.pagination);
      },
      error: err => {
        console.log('Error al obtener los anuncios:', err);
      }
    });
  }

  // Método para manejar el evento de refrescado de la página
  doRefresh(event: any) {
    this.loadMisanun(0, event.target);
  }

  // Método para manejar el evento de clic en una tarjeta de anuncio
  public async onCardClicked(misanun: Anuncio) {
    // Función que se ejecutará al cerrarse el modal
    var onDismiss = (info: any) => { }
    // Presentar el formulario de detalle del anuncio en un modal
    this.presentForm(misanun, onDismiss);
  }

  // Método para presentar el formulario de detalle del anuncio en un modal
  async presentForm(data: Anuncio | null, onDismiss: (result: any) => void) {
    const modal = await this.modal.create({
      component: AnuncioPerfilDetailComponent,
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

  // Método para presentar el formulario de añadir un nuevo anuncio en un modal
  async presentFormToAdd(data: Anuncio | null, onDismiss: (result: any) => void) {
    const modal = await this.modal.create({
      component: AnuncioFormComponent,
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

  // Método para manejar la creación de un nuevo anuncio
  onNewAnuncio() {
    // Presentar el formulario para añadir un nuevo anuncio en un modal
    this.presentFormToAdd(null, (result) => {
      if (result && result.data) {
        // Agregar el ID del usuario al anuncio creado
        result.data['userId'] = this.auth.getUserId();
        // Llamar al servicio para añadir el anuncio
        if (result.data.imgs) {
          dataURLtoBlob(result.data.imgs, (blob: Blob)=>{
            this.media.upload(blob).subscribe((media:any[])=>{
              result.data.imgs = media[0];
              for (const [key, value] of Object.entries(result.data)){
                (result as any)[key]=value;
              }
              this.misanuns.addAnuncio(result.data).subscribe({
                next: (response) => {
                  // Mostrar un mensaje de éxito
                  this.showToast('Anuncio creado exitosamente');
                  // Recargar la página
                  location.reload();
                },
                error: (err) => {
                  console.error('Error al crear el anuncio:', err);
                  // Mostrar un mensaje de error
                  this.showToast('Error al crear el anuncio');
                },
              });
            })
          })
        } else {
          if (result.data.imgs =="") {
            result.data.imgs = null;
          }
          for (const [key, value] of Object.entries(result.data)) {
            (result as any)[key]=value;
          }
          this.misanuns.addAnuncio(result.data).subscribe({
            next: (response) => {
              // Mostrar un mensaje de éxito
              this.showToast('Anuncio creado exitosamente');
              // Recargar la página
              location.reload();
            },
            error: (err) => {
              console.error('Error al crear el anuncio:', err);
              // Mostrar un mensaje de error
              this.showToast('Error al crear el anuncio');
            },
          });
        }
      }
    });
  }

  // Método para mostrar un mensaje de toast
  private async showToast(message: string) {
    const toast = await this.toast.create({
      message,
      duration: 2000,
    });
    toast.present();
  }
}
