import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Anuncio } from 'src/app/core/interfaces/anuncios';

@Component({
  selector: 'app-anuncio-detail',
  templateUrl: './anuncio-detail.component.html',
  styleUrls: ['./anuncio-detail.component.css']
})
export class AnuncioDetailComponent implements OnInit {
  @Input() anuncio:Anuncio | null=null;

  constructor(
    private route: ActivatedRoute,
    private _modal: ModalController
  ) {}

  ngOnInit() {}

  onCancel(){
    this._modal.dismiss(null, 'cancel');
  }
}
