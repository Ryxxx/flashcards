import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVariante } from '../variante.model';
import { VarianteService } from '../service/variante.service';

@Component({
  templateUrl: './variante-delete-dialog.component.html',
})
export class VarianteDeleteDialogComponent {
  variante?: IVariante;

  constructor(protected varianteService: VarianteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.varianteService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
