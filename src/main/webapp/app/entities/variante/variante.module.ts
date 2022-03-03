import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VarianteComponent } from './list/variante.component';
import { VarianteDetailComponent } from './detail/variante-detail.component';
import { VarianteUpdateComponent } from './update/variante-update.component';
import { VarianteDeleteDialogComponent } from './delete/variante-delete-dialog.component';
import { VarianteRoutingModule } from './route/variante-routing.module';

@NgModule({
  imports: [SharedModule, VarianteRoutingModule],
  declarations: [VarianteComponent, VarianteDetailComponent, VarianteUpdateComponent, VarianteDeleteDialogComponent],
  entryComponents: [VarianteDeleteDialogComponent],
})
export class VarianteModule {}
