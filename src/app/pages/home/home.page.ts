import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController, ToastOptions } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Anuncio } from 'src/app/core/interfaces/anuncios';
import { Pagination } from 'src/app/core/interfaces/data';
import { AnunciosService } from 'src/app/core/services/anuncios.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  private _anuncios = new BehaviorSubject<Anuncio[]>([]);
  public anuncios$ = this._anuncios.asObservable();
  public _pagination = new BehaviorSubject<Pagination>({page:0, pageSize:0, pageCount:0, total:0});
  private pagination$ = this._pagination.asObservable();

  private _loading = new BehaviorSubject<boolean>(false);
  public loading$ = this._loading.asObservable();

  constructor(
    private router:Router,
    public anunciosService:AnunciosService,
    private toast:ToastController,
    private modal:ModalController
  ) {
  }

  private loadAnuncios(page:number=0, refresher:any=null){
  
    this.anunciosService.query("").subscribe({
      next:response=>{
        this._anuncios.next(response.data);
        this._pagination.next(response.pagination);
        
        if(refresher)refresher.complete();
      },
      error:err=>{
        console.log(err);
      }
    });
  }

  ngOnInit():void{
    this.loadAnuncios();
  }

  doRefresh(event:any){
    this.loadAnuncios(0, event.target);
  }

  doInfinite(event:any){
    this.loadAnuncios(this._pagination.value.page+1, event.target);
  }

  public onDeleteClicked(anuncio:Anuncio){
    var _anuncio:Anuncio = {...anuncio};

    this.anunciosService.delAnuncio(_anuncio).subscribe(
        {next: anuncio=>{
        //Notificamos con un Toast que se ha pulsado
        const options:ToastOptions = {
          message:`Anuncio eliminado`, //mensaje del toast
          duration:1000, // 1 segundo
          position:'bottom', // el toast se situa en la parte inferior
          color:'danger', // color del toast
          cssClass:'fav-ion-toast' //Una clase que podemos poner en global.scss para configurar el ion-toast
        };
        //creamos el toast
        this.toast.create(options).then(toast=>toast.present());
        },
        error: err=>{
          console.log(err);
        }
      });
  }

  onFilter(){}

  public async onCardClicked(id: number) {
    this.router.navigate(['/anuncio', id]);
  }
}
