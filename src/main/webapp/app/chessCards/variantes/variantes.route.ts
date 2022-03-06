import { Route } from '@angular/router';

import { VariantesComponent } from './variantes.component';

export const VARIANTES_ROUTE: Route = {
  path: 'variantes/:id',
  component: VariantesComponent,
  data: {
    pageTitle: 'Mes variantes !',
  },
};
