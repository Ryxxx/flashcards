import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FlashCardsComponent } from '../list/flash-cards.component';
import { FlashCardsDetailComponent } from '../detail/flash-cards-detail.component';
import { FlashCardsUpdateComponent } from '../update/flash-cards-update.component';
import { FlashCardsRoutingResolveService } from './flash-cards-routing-resolve.service';

const flashCardsRoute: Routes = [
  {
    path: '',
    component: FlashCardsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FlashCardsDetailComponent,
    resolve: {
      flashCards: FlashCardsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FlashCardsUpdateComponent,
    resolve: {
      flashCards: FlashCardsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FlashCardsUpdateComponent,
    resolve: {
      flashCards: FlashCardsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(flashCardsRoute)],
  exports: [RouterModule],
})
export class FlashCardsRoutingModule {}
