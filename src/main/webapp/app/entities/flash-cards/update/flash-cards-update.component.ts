import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFlashCards, FlashCards } from '../flash-cards.model';
import { FlashCardsService } from '../service/flash-cards.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-flash-cards-update',
  templateUrl: './flash-cards-update.component.html',
})
export class FlashCardsUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    repetitions: [],
    qualite: [],
    facilite: [],
    intervalle: [],
    prochainEntrainement: [],
    userId: [],
  });

  constructor(
    protected flashCardsService: FlashCardsService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ flashCards }) => {
      this.updateForm(flashCards);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const flashCards = this.createFromForm();
    if (flashCards.id !== undefined) {
      this.subscribeToSaveResponse(this.flashCardsService.update(flashCards));
    } else {
      this.subscribeToSaveResponse(this.flashCardsService.create(flashCards));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFlashCards>>): void {
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

  protected updateForm(flashCards: IFlashCards): void {
    this.editForm.patchValue({
      id: flashCards.id,
      repetitions: flashCards.repetitions,
      qualite: flashCards.qualite,
      facilite: flashCards.facilite,
      intervalle: flashCards.intervalle,
      prochainEntrainement: flashCards.prochainEntrainement,
      userId: flashCards.userId,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, flashCards.userId);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('userId')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IFlashCards {
    return {
      ...new FlashCards(),
      id: this.editForm.get(['id'])!.value,
      repetitions: this.editForm.get(['repetitions'])!.value,
      qualite: this.editForm.get(['qualite'])!.value,
      facilite: this.editForm.get(['facilite'])!.value,
      intervalle: this.editForm.get(['intervalle'])!.value,
      prochainEntrainement: this.editForm.get(['prochainEntrainement'])!.value,
      userId: this.editForm.get(['userId'])!.value,
    };
  }
}
