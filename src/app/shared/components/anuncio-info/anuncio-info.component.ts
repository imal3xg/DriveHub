import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Anuncio } from 'src/app/core/interfaces/anuncios';

export interface UserInfoFavClicked{
  fav:boolean | undefined;
}

@Component({
  selector: 'app-anuncio-info',
  templateUrl: './anuncio-info.component.html',
  styleUrls: ['./anuncio-info.component.scss'],
})
export class AnuncioInfoComponent  implements OnInit{

  
  @Input() anun:Anuncio | null=null;

  @Output() onCardClicked:EventEmitter<void> = new EventEmitter<void>();
  @Output() onDeleteClicked:EventEmitter<void> = new EventEmitter<void>();
  
  constructor(
    private router:Router
  ) { }
  

  ngOnInit() {}

  onCardClick(){
    this.onCardClicked.emit();
  }
}