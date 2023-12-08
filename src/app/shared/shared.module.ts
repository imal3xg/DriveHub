import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { AnuncioInfoComponent } from './components/anuncio-info/anuncio-info.component';
import { AnuncioDetailComponent } from './components/anuncio-detail/anuncio-detail.component';
import { PerfilInfoComponent } from './components/perfil-info/perfil-info.component';
import { AnuncioItemComponent } from './components/anuncio-item/anuncio-item.component';




@NgModule({
  declarations: [
    LoginFormComponent,
    AnuncioInfoComponent,
    AnuncioDetailComponent,
    AnuncioItemComponent,
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
    AnuncioDetailComponent,
    AnuncioItemComponent,
    PerfilInfoComponent
  ]
})
export class SharedModule { }