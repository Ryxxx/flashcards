import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IVariante } from '../variante.model';
import { VarianteService } from '../service/variante.service';
import { VarianteDeleteDialogComponent } from '../delete/variante-delete-dialog.component';

@Component({
  selector: 'jhi-variante',
  templateUrl: './variante.component.html',
})
export class VarianteComponent implements OnInit {
  variantes?: IVariante[];
  isLoading = false;

  constructor(protected varianteService: VarianteService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.varianteService.query().subscribe({
      next: (res: HttpResponse<IVariante[]>) => {
        this.isLoading = false;
        this.variantes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IVariante): number {
    return item.id!;
  }

  delete(variante: IVariante): void {
    const modalRef = this.modalService.open(VarianteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.variante = variante;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
