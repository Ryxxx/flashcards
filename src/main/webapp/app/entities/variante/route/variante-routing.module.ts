import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VarianteComponent } from '../list/variante.component';
import { VarianteDetailComponent } from '../detail/variante-detail.component';
import { VarianteUpdateComponent } from '../update/variante-update.component';
import { VarianteRoutingResolveService } from './variante-routing-resolve.service';

const varianteRoute: Routes = [
  {
    path: '',
    component: VarianteComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VarianteDetailComponent,
    resolve: {
      variante: VarianteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VarianteUpdateComponent,
    resolve: {
      variante: VarianteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VarianteUpdateComponent,
    resolve: {
      variante: VarianteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(varianteRoute)],
  exports: [RouterModule],
})
export class VarianteRoutingModule {}
