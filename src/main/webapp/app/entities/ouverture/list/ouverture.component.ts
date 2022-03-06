import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOuverture } from '../ouverture.model';
import { OuvertureService } from '../service/ouverture.service';
import { OuvertureDeleteDialogComponent } from '../delete/ouverture-delete-dialog.component';

@Component({
  selector: 'jhi-ouverture',
  templateUrl: './ouverture.component.html',
})
export class OuvertureComponent implements OnInit {
  ouvertures?: IOuverture[];
  isLoading = false;

  constructor(protected ouvertureService: OuvertureService, protected modalService: NgbModal) {}

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

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IOuverture): number {
    return item.id!;
  }

  delete(ouverture: IOuverture): void {
    const modalRef = this.modalService.open(OuvertureDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.ouverture = ouverture;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
