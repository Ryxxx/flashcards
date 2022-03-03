import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OuvertureComponent } from './list/ouverture.component';
import { OuvertureDetailComponent } from './detail/ouverture-detail.component';
import { OuvertureUpdateComponent } from './update/ouverture-update.component';
import { OuvertureDeleteDialogComponent } from './delete/ouverture-delete-dialog.component';
import { OuvertureRoutingModule } from './route/ouverture-routing.module';

@NgModule({
  imports: [SharedModule, OuvertureRoutingModule],
  declarations: [OuvertureComponent, OuvertureDetailComponent, OuvertureUpdateComponent, OuvertureDeleteDialogComponent],
  entryComponents: [OuvertureDeleteDialogComponent],
})
export class OuvertureModule {}
