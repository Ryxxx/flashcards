import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVariante, Variante } from '../variante.model';
import { VarianteService } from '../service/variante.service';

@Injectable({ providedIn: 'root' })
export class VarianteRoutingResolveService implements Resolve<IVariante> {
  constructor(protected service: VarianteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVariante> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((variante: HttpResponse<Variante>) => {
          if (variante.body) {
            return of(variante.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Variante());
  }
}
