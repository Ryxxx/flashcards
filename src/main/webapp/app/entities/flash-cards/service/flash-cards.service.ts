import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFlashCards, getFlashCardsIdentifier } from '../flash-cards.model';

export type EntityResponseType = HttpResponse<IFlashCards>;
export type EntityArrayResponseType = HttpResponse<IFlashCards[]>;

@Injectable({ providedIn: 'root' })
export class FlashCardsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/flash-cards');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(flashCards: IFlashCards): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(flashCards);
    return this.http
      .post<IFlashCards>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(flashCards: IFlashCards): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(flashCards);
    return this.http
      .put<IFlashCards>(`${this.resourceUrl}/${getFlashCardsIdentifier(flashCards) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(flashCards: IFlashCards): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(flashCards);
    return this.http
      .patch<IFlashCards>(`${this.resourceUrl}/${getFlashCardsIdentifier(flashCards) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IFlashCards>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IFlashCards[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFlashCardsToCollectionIfMissing(
    flashCardsCollection: IFlashCards[],
    ...flashCardsToCheck: (IFlashCards | null | undefined)[]
  ): IFlashCards[] {
    const flashCards: IFlashCards[] = flashCardsToCheck.filter(isPresent);
    if (flashCards.length > 0) {
      const flashCardsCollectionIdentifiers = flashCardsCollection.map(flashCardsItem => getFlashCardsIdentifier(flashCardsItem)!);
      const flashCardsToAdd = flashCards.filter(flashCardsItem => {
        const flashCardsIdentifier = getFlashCardsIdentifier(flashCardsItem);
        if (flashCardsIdentifier == null || flashCardsCollectionIdentifiers.includes(flashCardsIdentifier)) {
          return false;
        }
        flashCardsCollectionIdentifiers.push(flashCardsIdentifier);
        return true;
      });
      return [...flashCardsToAdd, ...flashCardsCollection];
    }
    return flashCardsCollection;
  }

  protected convertDateFromClient(flashCards: IFlashCards): IFlashCards {
    return Object.assign({}, flashCards, {
      prochainEntrainement: flashCards.prochainEntrainement?.isValid() ? flashCards.prochainEntrainement.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.prochainEntrainement = res.body.prochainEntrainement ? dayjs(res.body.prochainEntrainement) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((flashCards: IFlashCards) => {
        flashCards.prochainEntrainement = flashCards.prochainEntrainement ? dayjs(flashCards.prochainEntrainement) : undefined;
      });
    }
    return res;
  }
}
