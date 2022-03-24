import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'ouverture',
        data: { pageTitle: 'Ouvertures' },
        loadChildren: () => import('./ouverture/ouverture.module').then(m => m.OuvertureModule),
      },
      {
        path: 'variante',
        data: { pageTitle: 'Variantes' },
        loadChildren: () => import('./variante/variante.module').then(m => m.VarianteModule),
      },
      {
        path: 'flash-cards',
        data: { pageTitle: 'FlashCards' },
        loadChildren: () => import('./flash-cards/flash-cards.module').then(m => m.FlashCardsModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
