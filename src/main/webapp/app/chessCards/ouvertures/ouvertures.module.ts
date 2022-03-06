import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { OUVERTURES_ROUTE } from './ouvertures.route';
import { OuverturesComponent } from './ouvertures.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([OUVERTURES_ROUTE])],
  declarations: [OuverturesComponent],
})
export class OuverturesModule {}
