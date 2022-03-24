import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FlashCardsComponent } from './list/flash-cards.component';
import { FlashCardsDetailComponent } from './detail/flash-cards-detail.component';
import { FlashCardsUpdateComponent } from './update/flash-cards-update.component';
import { FlashCardsDeleteDialogComponent } from './delete/flash-cards-delete-dialog.component';
import { FlashCardsRoutingModule } from './route/flash-cards-routing.module';

@NgModule({
  imports: [SharedModule, FlashCardsRoutingModule],
  declarations: [FlashCardsComponent, FlashCardsDetailComponent, FlashCardsUpdateComponent, FlashCardsDeleteDialogComponent],
  entryComponents: [FlashCardsDeleteDialogComponent],
})
export class FlashCardsModule {}
