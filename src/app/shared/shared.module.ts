import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { AnuncioInfoComponent } from './components/anuncio-info/anuncio-info.component';
import { AnuncioDetailComponent } from './components/anuncio-detail/anuncio-detail.component';
import { AnuncioItemComponent } from './components/anuncio-item/anuncio-item.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { TransformDatePipe } from './pipes/transform-date.pipe';
import { HeaderComponent } from './components/header/header.component';
import { MisanuncioInfoComponent } from './components/misanuncio-info/misanuncio-info.component';
import { MisanuncioDetailComponent } from './components/misanuncio-detail/misanuncio-detail.component';
import { ImgSelectableComponent } from './components/img-selectable/img-selectable.component';




@NgModule({
  declarations: [
    LoginFormComponent,
    RegisterFormComponent,
    AnuncioItemComponent,
    AnuncioInfoComponent,
    AnuncioDetailComponent,
    MisanuncioInfoComponent,
    MisanuncioDetailComponent,
    ImgSelectableComponent,
    HeaderComponent,
    TransformDatePipe,
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
    RegisterFormComponent,
    AnuncioInfoComponent,
    AnuncioDetailComponent,
    AnuncioItemComponent,
    MisanuncioInfoComponent,
    MisanuncioDetailComponent,
    ImgSelectableComponent,
    HeaderComponent
  ]
})
export class SharedModule { }