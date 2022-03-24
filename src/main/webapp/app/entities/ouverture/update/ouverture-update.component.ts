import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IOuverture, Ouverture } from '../ouverture.model';
import { OuvertureService } from '../service/ouverture.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { Couleur } from 'app/entities/enumerations/couleur.model';

@Component({
  selector: 'jhi-ouverture-update',
  templateUrl: './ouverture-update.component.html',
})
export class OuvertureUpdateComponent implements OnInit {
  isSaving = false;
  couleurValues = Object.keys(Couleur);

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [],
    couleur: [],
    premierCoups: [],
    userId: [],
  });

  constructor(
    protected ouvertureService: OuvertureService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ouverture }) => {
      this.updateForm(ouverture);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ouverture = this.createFromForm();
    if (ouverture.id !== undefined) {
      this.subscribeToSaveResponse(this.ouvertureService.update(ouverture));
    } else {
      this.subscribeToSaveResponse(this.ouvertureService.create(ouverture));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOuverture>>): void {
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

  protected updateForm(ouverture: IOuverture): void {
    this.editForm.patchValue({
      id: ouverture.id,
      nom: ouverture.nom,
      couleur: ouverture.couleur,
      premierCoups: ouverture.premierCoups,
      userId: ouverture.userId,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, ouverture.userId);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('userId')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IOuverture {
    return {
      ...new Ouverture(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      couleur: this.editForm.get(['couleur'])!.value,
      premierCoups: this.editForm.get(['premierCoups'])!.value,
      userId: this.editForm.get(['userId'])!.value,
    };
  }
}
