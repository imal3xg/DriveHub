import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { AnunciosService } from 'src/app/core/services/anuncios.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  constructor(
    private router:Router,
    public anunciosService:AnunciosService,
    private toast:ToastController,
    private modal:ModalController
  ) {}

  ngOnInit():void{
    this.anunciosService.getAllAnuncios().subscribe();
  }

  onFilter(){}

  goToAnuncioPage(id: number) {
    this.router.navigate(['/anuncio', id]);
  }
}
