import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Anuncio } from 'src/app/core/interfaces/anuncios';
import { AnuncioInfoComponent } from '../anuncio-info/anuncio-info.component';
import { Router } from '@angular/router';
import { AnuncioFormComponent } from '../anuncio-form/anuncio-form.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnunciosService } from 'src/app/core/services/anuncios.service';
import { AuthService } from 'src/app/core/services/api/auth.service';

@Component({
  selector: 'app-anuncio-detail',
  templateUrl: './anuncio-perfil-detail.component.html',
  styleUrls: ['./anuncio-perfil-detail.component.scss']
})

export class AnuncioPerfilDetailComponent implements OnInit {

  @Input() anun: Anuncio | null = null;
  if (_: any){
    this.changeDetectorRef.markForCheck();
  }
  @Input() mode:'New'|'Edit' = 'Edit';

  constructor(
    private _modal:ModalController,
    private changeDetectorRef: ChangeDetectorRef,
    private toast:ToastController,
    private misanuns:AnunciosService,
    private auth: AuthService
  ) {}

  ngOnInit() {}

  onCancel(){
    this._modal.dismiss(null, 'cancel');
  }
  
  async presentEditModal(data:Anuncio|null, onDismiss: (result: any) => void) {
    const modal = await this._modal.create({
      component: AnuncioFormComponent,
      componentProps: {
        anun: this.anun, // Pasar el valor del formulario actual
        mode: 'Edit' // Indicar que el modo es de edición
      },
      cssClass:"modal-full-right-side"
    });
    modal.present();
    modal.onDidDismiss().then(result => {
      if (result && result.data) {
        onDismiss(result);
      }
    });
  }
  
  onEdit() {
    // Verifica que this.anun y this.anun.id estén definidos
    if (this.anun && this.anun.id) {
      this.presentEditModal(this.anun, (result) => {
        if (result && result.data) {
          result.data['userId'] = this.auth.getUserId();
          result.data['id'] = this.anun!.id; // Agrega el id del anuncio a los datos
          this.misanuns.updateAnuncio(result.data).subscribe({
            next: (response) => {
              this.showToast('Anuncio editado exitosamente');
            },
            error: (err) => {
              console.error('Error al editar el anuncio:', err);
              this.showToast('Error al editar el anuncio');
            },
          });
        }
      });
    } else {
      console.error('El anuncio o su ID no están definidos.');
    }
  }

  onDelete() {
    if (this.anun && this.anun.id) {
      this.misanuns.deleteAnuncio(this.anun.id).subscribe({
        next: () => {
          this.showToast('Anuncio eliminado exitosamente');
          // Puedes realizar cualquier acción adicional aquí después de eliminar el anuncio
          this._modal.dismiss(null, 'delete'); // Cierra el modal después de eliminar
        },
        error: (err) => {
          console.error('Error al eliminar el anuncio:', err);
          this.showToast('Error al eliminar el anuncio');
        },
      });
    } else {
      console.error('El anuncio o su ID no están definidos.');
    }
  }

  private async showToast(message: string) {
    const toast = await this.toast.create({
      message,
      duration: 2000,
    });
    toast.present();
  }
}