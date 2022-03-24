import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFlashCards } from '../flash-cards.model';
import { FlashCardsService } from '../service/flash-cards.service';
import { FlashCardsDeleteDialogComponent } from '../delete/flash-cards-delete-dialog.component';

@Component({
  selector: 'jhi-flash-cards',
  templateUrl: './flash-cards.component.html',
})
export class FlashCardsComponent implements OnInit {
  flashCards?: IFlashCards[];
  isLoading = false;

  constructor(protected flashCardsService: FlashCardsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.flashCardsService.query().subscribe({
      next: (res: HttpResponse<IFlashCards[]>) => {
        this.isLoading = false;
        this.flashCards = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFlashCards): number {
    return item.id!;
  }

  delete(flashCards: IFlashCards): void {
    const modalRef = this.modalService.open(FlashCardsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.flashCards = flashCards;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
