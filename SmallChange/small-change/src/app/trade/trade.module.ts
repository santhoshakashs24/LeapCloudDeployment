import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradeComponent } from './trade/trade.component';
import { OrderInstrumentComponent } from './order-instrument/order-instrument.component';
import { Route, RouterModule } from '@angular/router';
import { IsLoggedInGuard } from '../guards/is-logged-in.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { InstrumentDetailComponent } from './instrument-detail/instrument-detail.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const tradeRoutes: Route[]=[
  {path:'trade', component: TradeComponent, canActivate:[IsLoggedInGuard]},
  {path:'trade/:portfolioId/:direction/:instrumentId', component: TradeComponent, canActivate:[IsLoggedInGuard]}
]

@NgModule({
  declarations: [
    TradeComponent,
    OrderInstrumentComponent,
    InstrumentDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    RouterModule.forChild(tradeRoutes)
  ],
  exports:[
    TradeComponent,
    RouterModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class TradeModule { }
