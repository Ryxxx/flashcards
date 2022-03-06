import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { VARIANTES_ROUTE } from './variantes.route';
import { VariantesComponent } from './variantes.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([VARIANTES_ROUTE])],
  declarations: [VariantesComponent],
})
export class VariantesModule {}
