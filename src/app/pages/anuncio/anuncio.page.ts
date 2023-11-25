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
    // Recuperar el id de la URL
    this.route.params.subscribe(params => {
      const id = +params['id']; // '+' convierte el parámetro a número si es un string
      this.anunciosService.anuncios$.subscribe(anuncios => {
        this.anuncio = anuncios.find(anuncio => anuncio.id === id);
      });
  
      // Ahora, puedes usar el id para cargar la información del anuncio
      // (implementa lógica para cargar datos según el id)
    });
  }

}
