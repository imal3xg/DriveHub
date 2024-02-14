import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Anuncio } from 'src/app/core/interfaces/anuncios';
import { AnuncioFormComponent } from '../anuncio-form/anuncio-form.component';
import { AnunciosService } from 'src/app/core/services/anuncios.service';
import { AuthService } from 'src/app/core/services/api/auth.service';

@Component({
  selector: 'app-anuncio-detail',
  templateUrl: './anuncio-perfil-detail.component.html',
  styleUrls: ['./anuncio-perfil-detail.component.scss']
})
export class AnuncioPerfilDetailComponent implements OnInit {

  // Entrada del componente que representa el anuncio a mostrar
  @Input() anun: Anuncio | null = null;

  // Modo del componente, puede ser 'New' o 'Edit'
  @Input() mode: 'New' | 'Edit' = 'Edit';

  // Constructor del componente
  constructor(
    private _modal: ModalController,
    private toast: ToastController,
    private misanuns: AnunciosService,
    private auth: AuthService
  ) {}

  // Método ngOnInit, se ejecuta cuando se inicia el componente
  ngOnInit() {}

  // Método para cancelar la visualización del detalle del anuncio
  onCancel() {
    this._modal.dismiss(null, 'cancel');
  }
  
  // Método para abrir el modal de edición del anuncio
  async presentEditModal(data: Anuncio | null, onDismiss: (result: any) => void) {
    const modal = await this._modal.create({
      component: AnuncioFormComponent,
      componentProps: {
        anun: this.anun,
        mode: 'Edit'
      },
      cssClass: "modal-full-right-side"
    });
    modal.present();
    // Manejar el evento cuando el modal se cierra
    modal.onDidDismiss().then(result => {
      if (result && result.data) {
        onDismiss(result);
      }
    });
  }
  
  // Método para editar el anuncio
  onEdit() {
    if (this.anun && this.anun.id) {
      // Abrir el modal de edición
      this.presentEditModal(this.anun, (result) => {
        if (result && result.data) {
          // Agregar el ID del usuario al anuncio editado
          result.data['userId'] = this.auth.getUserId();
          result.data['id'] = this.anun!.id;
          result.data['imgs'] = this.anun?.imgs?.data
          // Llamar al servicio para actualizar el anuncio
          this.misanuns.updateAnuncio(result.data).subscribe({
            next: (response) => {

              // Mostrar un mensaje de éxito
              this.showToast('Anuncio editado exitosamente');
              // Recargar la página
              location.reload();
            },
            error: (err) => {
              console.error('Error al editar el anuncio:', err);
              // Mostrar un mensaje de error
              this.showToast('Error al editar el anuncio');
            },
          });
        }
      });
    } else {
      console.error('El anuncio o su ID no están definidos.');
    }
  }

  // Método para eliminar el anuncio
  onDelete() {
    if (this.anun && this.anun.id) {
      // Llamar al servicio para eliminar el anuncio
      this.misanuns.deleteAnuncio(this.anun.id).subscribe({
        next: () => {
          // Mostrar un mensaje de éxito
          this.showToast('Anuncio eliminado exitosamente');
          // Cerrar el modal
          this._modal.dismiss(null, 'delete');
          // Recargar la página
          location.reload();
        },
        error: (err) => {
          console.error('Error al eliminar el anuncio:', err);
          // Mostrar un mensaje de error
          this.showToast('Error al eliminar el anuncio');
        },
      });
    } else {
      console.error('El anuncio o su ID no están definidos.');
    }
  }

  // Método privado para mostrar un mensaje de toast
  private async showToast(message: string) {
    const toast = await this.toast.create({
      message,
      duration: 2000,
    });
    toast.present();
  }
}
