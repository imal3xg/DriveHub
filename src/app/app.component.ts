import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private router:Router
  ) {}

  public home(){
    this.router.navigate(['/home'])
  }

  public anuncio(){
    this.router.navigate(['/anuncio'])
  }

  public perfil(){
    this.router.navigate(['/perfil'])
  }

  public preguntas(){
    this.router.navigate(['/preguntas'])
  }
}
