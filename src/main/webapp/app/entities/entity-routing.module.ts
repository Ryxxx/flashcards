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
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
