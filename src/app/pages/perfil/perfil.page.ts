import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController, ToastOptions } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Pagination } from 'src/app/core/interfaces/data';
import { User } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/core/services/api/auth.service';
import { MediaService } from 'src/app/core/services/api/media.service';
import { dataURLtoBlob } from 'src/app/core/helpers/blob';
import { MisanuncioDetailComponent } from 'src/app/shared/components/misanuncio-detail/misanuncio-detail.component';
import { AppComponent } from 'src/app/app.component';
import { AnunciosService } from 'src/app/core/services/anuncios.service';
import { Anuncio } from 'src/app/core/interfaces/anuncios';
import { AnuncioDetailComponent } from 'src/app/shared/components/anuncio-detail/anuncio-detail.component';
import { AnuncioPerfilDetailComponent } from 'src/app/shared/components/anuncio-perfil-detail/anuncio-perfil-detail.component';
import { AnuncioFormComponent } from 'src/app/shared/components/anuncio-form/anuncio-form.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  private _misanuns = new BehaviorSubject<Anuncio[]>([]);
  public anuns$ = this._misanuns.asObservable();
  public _pagination = new BehaviorSubject<Pagination>({page:0, pageSize:0, pageCount:0, total:0});
  private pagination$ = this._pagination.asObservable();

  constructor(
    private toast:ToastController,
    public auth:AuthService,
    public misanuns:AnunciosService,
    private modal:ModalController,
  ) { }

  private loadMisanun(page:number=0, refresher:any=null){
    this.misanuns.query("").subscribe({
      next:response=>{
        this._misanuns.next(response.data);
        this._pagination.next(response.pagination);
        if(refresher)refresher.complete();
      },
      error:err=>{
        console.log(err);
      }
    });
  }

  ngOnInit(): void {
    this.auth.user$.subscribe(user=> {
      if (user?.id){
        this.getAnuncios(user.id);
      }
    })
  }

  private getAnuncios(userId: number) {
    this.misanuns.getAllUserAnuncios(userId).subscribe({
      next:response => {
        this._misanuns.next(response.data);
        this._pagination.next(response.pagination);
      },
      error:err => {
         console.log('Error al obtener los anuncios:', err);
      }
    });   
  }

  doRefresh(event:any){
    this.loadMisanun(0, event.target);
  }

  public async onCardClicked(misanun:Anuncio){
    var onDismiss = (info:any)=>{}
    this.presentForm(misanun, onDismiss);
  }

  async presentForm(data:Anuncio|null, onDismiss:(result:any)=>void){
    const modal = await this.modal.create({
      component:AnuncioPerfilDetailComponent,
      componentProps:{
        anun:data
      },
      cssClass:"modal-full-right-side"
    });
    modal.present();
    modal.onDidDismiss().then(result=>{
      if(result && result.data){
        onDismiss(result);
      }
    });
  }

  async presentFormToAdd(data:Anuncio|null, onDismiss:(result:any)=>void){
    const modal = await this.modal.create({
      component:AnuncioFormComponent,
      componentProps:{
        anun:data
      },
      cssClass:"modal-full-right-side"
    });
    modal.present();
    modal.onDidDismiss().then(result=>{
      if(result && result.data){
        onDismiss(result);
      }
    });
  }

  onNewAnuncio(){
    this.presentFormToAdd(null, (result) => {
      if (result && result.data) {
        result.data['userId'] = this.auth.getUserId();
        this.misanuns.addAnuncio(result.data).subscribe({
          next: (response) => {
            // Muestra un mensaje de éxito o realiza acciones adicionales
            this.showToast('Anuncio creado exitosamente');
          },
          error: (err) => {
            console.error('Error al crear el anuncio:', err);
            // Muestra un mensaje de error o realiza acciones adicionales
            this.showToast('Error al crear el anuncio');
          },
        });
      }
    });
  }
  
  private async showToast(message: string) {
    const toast = await this.toast.create({
      message,
      duration: 2000,
    });
    toast.present();
  }
}