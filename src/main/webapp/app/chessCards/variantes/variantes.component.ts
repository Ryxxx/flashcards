import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { VarianteService } from 'app/entities/variante/service/variante.service';
import { Variante, IVariante } from 'app/entities/variante/variante.model';

import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'jhi-variantes',
  templateUrl: './variantes.component.html',
  styleUrls: ['./variantes.component.scss'],
})
export class VariantesComponent implements OnInit {
  isLoading = false;
  ouverturesId: number;
  variantes: Array<Variante> = [];

  constructor(private variantesService: VarianteService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;

    this.route.queryParams.subscribe(params => {
      this.ouverturesId = params['id'];
    });

    this.variantesService.query({ 'id.equals': this.ouverturesId }).subscribe(
      (res: HttpResponse<IVariante[]>) => {
        this.isLoading = false;
        this.variantes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}
