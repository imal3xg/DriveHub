import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnuncioInfoComponent } from './components/anuncio-info/anuncio-info.component';
import { PerfilInfoComponent } from './components/perfil-info/perfil-info.component';



@NgModule({
  declarations: [
    //Components
    AnuncioInfoComponent,
    PerfilInfoComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[
    CommonModule, 
    IonicModule, 
    FormsModule,
    //Components
    AnuncioInfoComponent,
    PerfilInfoComponent
  ]
})
export class SharedModule { }