import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOuverture } from '../ouverture.model';

@Component({
  selector: 'jhi-ouverture-detail',
  templateUrl: './ouverture-detail.component.html',
})
export class OuvertureDetailComponent implements OnInit {
  ouverture: IOuverture | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ouverture }) => {
      this.ouverture = ouverture;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
