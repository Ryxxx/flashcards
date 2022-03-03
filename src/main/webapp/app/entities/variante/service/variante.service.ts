import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVariante, getVarianteIdentifier } from '../variante.model';

export type EntityResponseType = HttpResponse<IVariante>;
export type EntityArrayResponseType = HttpResponse<IVariante[]>;

@Injectable({ providedIn: 'root' })
export class VarianteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/variantes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(variante: IVariante): Observable<EntityResponseType> {
    return this.http.post<IVariante>(this.resourceUrl, variante, { observe: 'response' });
  }

  update(variante: IVariante): Observable<EntityResponseType> {
    return this.http.put<IVariante>(`${this.resourceUrl}/${getVarianteIdentifier(variante) as number}`, variante, { observe: 'response' });
  }

  partialUpdate(variante: IVariante): Observable<EntityResponseType> {
    return this.http.patch<IVariante>(`${this.resourceUrl}/${getVarianteIdentifier(variante) as number}`, variante, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVariante>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVariante[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addVarianteToCollectionIfMissing(varianteCollection: IVariante[], ...variantesToCheck: (IVariante | null | undefined)[]): IVariante[] {
    const variantes: IVariante[] = variantesToCheck.filter(isPresent);
    if (variantes.length > 0) {
      const varianteCollectionIdentifiers = varianteCollection.map(varianteItem => getVarianteIdentifier(varianteItem)!);
      const variantesToAdd = variantes.filter(varianteItem => {
        const varianteIdentifier = getVarianteIdentifier(varianteItem);
        if (varianteIdentifier == null || varianteCollectionIdentifiers.includes(varianteIdentifier)) {
          return false;
        }
        varianteCollectionIdentifiers.push(varianteIdentifier);
        return true;
      });
      return [...variantesToAdd, ...varianteCollection];
    }
    return varianteCollection;
  }
}
