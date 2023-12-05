import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { AnuncioInfoComponent } from './components/anuncio-info/anuncio-info.component';
import { PerfilInfoComponent } from './components/perfil-info/perfil-info.component';




@NgModule({
  declarations: [
    LoginFormComponent,
    AnuncioInfoComponent,
    PerfilInfoComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports:[
    CommonModule, 
    IonicModule, 
    FormsModule,
    LoginFormComponent,
    AnuncioInfoComponent,
    PerfilInfoComponent
  ]
})
export class SharedModule { }