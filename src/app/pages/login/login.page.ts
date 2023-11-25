import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { PerfilService } from 'src/app/core/services/perfil.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private router:Router,
    public perfilService:PerfilService,
    private toast:ToastController,
    private modal:ModalController
  ) { }

  ngOnInit():void{
    this.perfilService.getAllPerfiles().subscribe();
  }

  goToProfilePage(id: number) {
    this.router.navigate(['/perfil', id]);
  }
}
