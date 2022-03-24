import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFlashCards } from '../flash-cards.model';

@Component({
  selector: 'jhi-flash-cards-detail',
  templateUrl: './flash-cards-detail.component.html',
})
export class FlashCardsDetailComponent implements OnInit {
  flashCards: IFlashCards | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ flashCards }) => {
      this.flashCards = flashCards;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
