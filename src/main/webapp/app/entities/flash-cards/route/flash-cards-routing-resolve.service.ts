import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFlashCards, FlashCards } from '../flash-cards.model';
import { FlashCardsService } from '../service/flash-cards.service';

@Injectable({ providedIn: 'root' })
export class FlashCardsRoutingResolveService implements Resolve<IFlashCards> {
  constructor(protected service: FlashCardsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFlashCards> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((flashCards: HttpResponse<FlashCards>) => {
          if (flashCards.body) {
            return of(flashCards.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new FlashCards());
  }
}
