import { Route } from '@angular/router';

import { OuverturesComponent } from './ouvertures.component';

export const OUVERTURES_ROUTE: Route = {
  path: 'ouvertures',
  component: OuverturesComponent,
  data: {
    pageTitle: 'Mes ouvertures!',
  },
};
