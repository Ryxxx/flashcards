import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFlashCards } from '../flash-cards.model';
import { FlashCardsService } from '../service/flash-cards.service';

@Component({
  templateUrl: './flash-cards-delete-dialog.component.html',
})
export class FlashCardsDeleteDialogComponent {
  flashCards?: IFlashCards;

  constructor(protected flashCardsService: FlashCardsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.flashCardsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
