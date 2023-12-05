import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { AnunciosService } from 'src/app/core/services/anuncios.service';
import { Homeanuncios } from 'src/app/core/interfaces/homeanuncios';

@Component({
  selector: 'app-anuncio',
  templateUrl: './anuncio.page.html',
  styleUrls: ['./anuncio.page.scss'],
})
export class AnuncioPage implements OnInit {
  anuncio: any;

  constructor(
    private router:Router,
    private route:ActivatedRoute,
    public anunciosService:AnunciosService,
    private toast:ToastController,
    private modal:ModalController
  ) { }

  ngOnInit() {
  }

}
