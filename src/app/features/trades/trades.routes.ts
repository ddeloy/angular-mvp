import { Routes } from '@angular/router';
import { TradesComponent } from './trades.component';

export const TRADE_ROUTES: Routes = [
  {
    path: '', // This will serve as the default path for lazy loading
    component: TradesComponent,
  },
];
