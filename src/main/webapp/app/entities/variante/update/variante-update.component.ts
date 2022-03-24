import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IVariante, Variante } from '../variante.model';
import { VarianteService } from '../service/variante.service';
import { IOuverture } from 'app/entities/ouverture/ouverture.model';
import { OuvertureService } from 'app/entities/ouverture/service/ouverture.service';

@Component({
  selector: 'jhi-variante-update',
  templateUrl: './variante-update.component.html',
})
export class VarianteUpdateComponent implements OnInit {
  isSaving = false;

  ouverturesSharedCollection: IOuverture[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [],
    coups: [],
    ouverture: [],
  });

  constructor(
    protected varianteService: VarianteService,
    protected ouvertureService: OuvertureService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ variante }) => {
      this.updateForm(variante);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const variante = this.createFromForm();
    if (variante.id !== undefined) {
      this.subscribeToSaveResponse(this.varianteService.update(variante));
    } else {
      this.subscribeToSaveResponse(this.varianteService.create(variante));
    }
  }

  trackOuvertureById(index: number, item: IOuverture): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVariante>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(variante: IVariante): void {
    this.editForm.patchValue({
      id: variante.id,
      nom: variante.nom,
      coups: variante.coups,
      ouverture: variante.ouverture,
    });

    this.ouverturesSharedCollection = this.ouvertureService.addOuvertureToCollectionIfMissing(
      this.ouverturesSharedCollection,
      variante.ouverture
    );
  }

  protected loadRelationshipsOptions(): void {
    this.ouvertureService
      .query()
      .pipe(map((res: HttpResponse<IOuverture[]>) => res.body ?? []))
      .pipe(
        map((ouvertures: IOuverture[]) =>
          this.ouvertureService.addOuvertureToCollectionIfMissing(ouvertures, this.editForm.get('ouverture')!.value)
        )
      )
      .subscribe((ouvertures: IOuverture[]) => (this.ouverturesSharedCollection = ouvertures));
  }

  protected createFromForm(): IVariante {
    return {
      ...new Variante(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      coups: this.editForm.get(['coups'])!.value,
      ouverture: this.editForm.get(['ouverture'])!.value,
    };
  }
}
