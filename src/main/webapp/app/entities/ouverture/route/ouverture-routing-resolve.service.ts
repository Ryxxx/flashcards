import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOuverture, Ouverture } from '../ouverture.model';
import { OuvertureService } from '../service/ouverture.service';

@Injectable({ providedIn: 'root' })
export class OuvertureRoutingResolveService implements Resolve<IOuverture> {
  constructor(protected service: OuvertureService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOuverture> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((ouverture: HttpResponse<Ouverture>) => {
          if (ouverture.body) {
            return of(ouverture.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Ouverture());
  }
}
