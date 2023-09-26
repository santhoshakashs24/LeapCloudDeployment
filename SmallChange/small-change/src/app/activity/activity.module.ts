import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpandPipe, TradeHistoryComponent } from './trade-history/trade-history.component';
import { Route, RouterModule } from '@angular/router';
import { IsLoggedInGuard } from '../guards/is-logged-in.guard';

const tradeRoutes: Route[] = [
  {
    path: 'activity', component: TradeHistoryComponent, canActivate:[IsLoggedInGuard]
  }
]

@NgModule({
  declarations: [TradeHistoryComponent,
  ExpandPipe],
  imports: [
    CommonModule,
    RouterModule.forChild(tradeRoutes)
  ],
  exports: [TradeHistoryComponent,
    RouterModule],
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ActivityModule { }
