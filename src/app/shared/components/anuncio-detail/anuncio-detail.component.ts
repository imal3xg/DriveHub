import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-anuncio-detail',
  templateUrl: './anuncio-detail.component.html',
  styleUrls: ['./anuncio-detail.component.css']
})
export class AnuncioDetailComponent implements OnInit {
  anuncioId: number | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.anuncioId = +this.route.snapshot.paramMap.get('id')!!;
    // Aquí puedes cargar los detalles del anuncio utilizando el anuncioId
  }
}
