import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Perfil } from 'src/app/core/interfaces/perfil';

@Component({
  selector: 'app-perfil-info',
  templateUrl: './perfil-info.component.html',
  styleUrls: ['./perfil-info.component.scss'],
})
export class PerfilInfoComponent  implements OnInit {

  @Input() perfil!:Perfil;
  @Output() onCardClicked:EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private router: Router
  ) { }

  ngOnInit() {}

  onCardClick(){
    this.onCardClicked.emit();
  }
}
