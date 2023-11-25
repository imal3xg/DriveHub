import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { PerfilService } from 'src/app/core/services/perfil.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  perfil: any
  anuncios: any;

  constructor(
    private router:Router,
    private route:ActivatedRoute,
    public perfilService:PerfilService,
    private toast:ToastController,
    private modal:ModalController
  ) { }

  ngOnInit() {
    this.perfilService.getAllPerfiles();
    // Recuperar el id de la URL
    this.route.params.subscribe(params => {
      const id = +params['id']; // '+' convierte el parámetro a número si es un string
      this.perfilService.perfiles$.subscribe(perfiles => {
        this.perfil = perfiles.find(perfil => perfil.id === id);
      });
  
      // Ahora, puedes usar el id para cargar la información del anuncio
      // (implementa lógica para cargar datos según el id)
    });
  }

  goToAnuncioPage(id: number) {
    this.router.navigate(['/anuncio', id]);
  }

  agregarAnuncio(){

  }

}
