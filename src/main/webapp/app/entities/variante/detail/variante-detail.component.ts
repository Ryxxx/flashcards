import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVariante } from '../variante.model';

@Component({
  selector: 'jhi-variante-detail',
  templateUrl: './variante-detail.component.html',
})
export class VarianteDetailComponent implements OnInit {
  variante: IVariante | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ variante }) => {
      this.variante = variante;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
