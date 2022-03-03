import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOuverture } from '../ouverture.model';
import { OuvertureService } from '../service/ouverture.service';

@Component({
  templateUrl: './ouverture-delete-dialog.component.html',
})
export class OuvertureDeleteDialogComponent {
  ouverture?: IOuverture;

  constructor(protected ouvertureService: OuvertureService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ouvertureService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
