import { Component, OnInit } from '@angular/core';
import { Ouverture, IOuverture } from '../../entities/ouverture/ouverture.model';
import { OuvertureService } from 'app/entities/ouverture/service/ouverture.service';

import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
@Component({
  selector: 'jhi-ouvertures',
  templateUrl: './ouvertures.component.html',
  styleUrls: ['./ouvertures.component.scss'],
})
export class OuverturesComponent implements OnInit {
  ouvertures: Array<Ouverture> = [];
  isLoading = false;

  constructor(private ouvertureService: OuvertureService, private router: Router) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;

    this.ouvertureService.query().subscribe(
      (res: HttpResponse<IOuverture[]>) => {
        this.isLoading = false;
        this.ouvertures = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  goToVariantes(ouverture: Ouverture): void {
    this.router.navigate(['/variantes/' + String(ouverture.id)]);
  }
}
