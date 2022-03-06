import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOuverture, getOuvertureIdentifier } from '../ouverture.model';

export type EntityResponseType = HttpResponse<IOuverture>;
export type EntityArrayResponseType = HttpResponse<IOuverture[]>;

@Injectable({ providedIn: 'root' })
export class OuvertureService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ouvertures');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(ouverture: IOuverture): Observable<EntityResponseType> {
    return this.http.post<IOuverture>(this.resourceUrl, ouverture, { observe: 'response' });
  }

  update(ouverture: IOuverture): Observable<EntityResponseType> {
    return this.http.put<IOuverture>(`${this.resourceUrl}/${getOuvertureIdentifier(ouverture) as number}`, ouverture, {
      observe: 'response',
    });
  }

  partialUpdate(ouverture: IOuverture): Observable<EntityResponseType> {
    return this.http.patch<IOuverture>(`${this.resourceUrl}/${getOuvertureIdentifier(ouverture) as number}`, ouverture, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOuverture>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOuverture[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOuvertureToCollectionIfMissing(
    ouvertureCollection: IOuverture[],
    ...ouverturesToCheck: (IOuverture | null | undefined)[]
  ): IOuverture[] {
    const ouvertures: IOuverture[] = ouverturesToCheck.filter(isPresent);
    if (ouvertures.length > 0) {
      const ouvertureCollectionIdentifiers = ouvertureCollection.map(ouvertureItem => getOuvertureIdentifier(ouvertureItem)!);
      const ouverturesToAdd = ouvertures.filter(ouvertureItem => {
        const ouvertureIdentifier = getOuvertureIdentifier(ouvertureItem);
        if (ouvertureIdentifier == null || ouvertureCollectionIdentifiers.includes(ouvertureIdentifier)) {
          return false;
        }
        ouvertureCollectionIdentifiers.push(ouvertureIdentifier);
        return true;
      });
      return [...ouverturesToAdd, ...ouvertureCollection];
    }
    return ouvertureCollection;
  }
}
