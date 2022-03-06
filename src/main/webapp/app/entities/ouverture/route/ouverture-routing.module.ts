import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OuvertureComponent } from '../list/ouverture.component';
import { OuvertureDetailComponent } from '../detail/ouverture-detail.component';
import { OuvertureUpdateComponent } from '../update/ouverture-update.component';
import { OuvertureRoutingResolveService } from './ouverture-routing-resolve.service';

const ouvertureRoute: Routes = [
  {
    path: '',
    component: OuvertureComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OuvertureDetailComponent,
    resolve: {
      ouverture: OuvertureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OuvertureUpdateComponent,
    resolve: {
      ouverture: OuvertureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OuvertureUpdateComponent,
    resolve: {
      ouverture: OuvertureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ouvertureRoute)],
  exports: [RouterModule],
})
export class OuvertureRoutingModule {}
