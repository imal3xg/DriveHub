import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController, ToastOptions } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Pagination } from 'src/app/core/interfaces/data';
import { User } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/core/services/api/auth.service';
import { MediaService } from 'src/app/core/services/api/media.service';
import { MisanuncioService } from 'src/app/core/services/misanuncio.service';
import { Misanuncio } from 'src/app/core/interfaces/misanuncio';
import { dataURLtoBlob } from 'src/app/core/helpers/blob';
import { MisanuncioDetailComponent } from 'src/app/shared/components/misanuncio-detail/misanuncio-detail.component';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  private id = 0;
  private _misanuns = new BehaviorSubject<Misanuncio[]>([]);
  public misanuns$ = this._misanuns.asObservable();
  public _pagination = new BehaviorSubject<Pagination>({page:0, pageSize:0, pageCount:0, total:0});
  private pagination$ = this._pagination.asObservable();

  constructor(
    private router:Router,
    private toast:ToastController,
    public auth:AuthService,
    private appComponent: AppComponent,
    public misanuns:MisanuncioService,
    private media:MediaService,
    private modal:ModalController
  ) {
    
  }

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
    this.auth.me().subscribe(user=>{
      if(user.id !== null){
        this.id = user.id;
        this.loadMisanun();
      }
    });
  }

  doRefresh(event:any){
    this.loadMisanun(0, event.target);
  }

  public async onCardClicked(misanun:Misanuncio){
    var onDismiss = (info:any)=>{
      console.log(info);
      switch(info.role){
        case 'ok':{
          if(info.data.picture){
            dataURLtoBlob(info.data.picture,(blob:Blob)=>{
              this.media.upload(blob).subscribe((media:number[])=>{
                info.data.picture = media[0];
                let _misanun = {id:misanun.id, ...info.data};
                this.misanuns.updateMisanuncio(_misanun).subscribe(async misanun=>{
                  this.loadMisanun()});
              });
            });
          }
          else{
            if(info.data.picture=="")
              info.data.picture = null;
            this.misanuns.updateMisanuncio(info.data).subscribe(async misanun=>{
                this.loadMisanun()});
          }
        }
        break;
        case 'delete':{
          this.misanuns.deleteMisanuncio(info.data).subscribe(async misanun=>{
            this.loadMisanun()})
        }
        break;
        default:{
          console.error("No debería entrar");
        }
      }
    }
    this.presentForm(misanun, onDismiss);
  }

  async presentForm(data:Misanuncio|null, onDismiss:(result:any)=>void){
    const modal = await this.modal.create({
      component:MisanuncioDetailComponent,
      componentProps:{
        mode:data?'Edit':'New',
        misanun:data
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
    this.presentForm(null, (result) => {
      if (result && result.data) {
        dataURLtoBlob(result.data.picture, (blob:Blob)=>{
          this.media.upload(blob).subscribe((media: number[])=>{
            result.data.img = media[0];
            this.misanuns.addMisanuncio(result.data).subscribe(_ => {
              console.log('Result of add new place', result);
              this.toast.create({
                message: 'Place added successfully',
                duration: 2000,
                position: 'middle',
                color: 'success'
              }).then(toast => {
                toast.present();
              });
            });
          }
          )}
      )}
    });
  }
}
