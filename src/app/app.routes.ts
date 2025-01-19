import { Routes } from '@angular/router';
import { provideRouter, withHashLocation } from '@angular/router';

export const routes: Routes = [
  {
    path: 'overview',
    loadChildren: () =>
      import('./features/overview/overview.routes').then(
        (m) => m.OVERVIEW_ROUTES
      ),
  },
  {
    path: 'pivot-dashboard',
    loadChildren: () =>
      import('./features/pivot-dashboard/pivot-dashboard.routes').then(
        (m) => m.PIVOT_ROUTES
      ),
  },
  {
    path: 'pivot-pma',
    loadChildren: () =>
      import('./features/pivot-pma/pivot-pma.routes').then((m) => m.PMA_ROUTES),
  },
  {
    path: 'resources',
    loadChildren: () =>
      import('./features/resources/resources.routes').then(
        (m) => m.RESOURCES_ROUTES
      ),
  },
  {
    path: 'trades',
    loadChildren: () =>
      import('./features/trades/trades.routes').then(
        (m) => m.TRADE_ROUTES // Use "tradesRoutes" as the export
      ),
  },
  {
    path: '',
    redirectTo: '/overview',
    pathMatch: 'full', // Explicitly specify "full"
  },
  {
    path: '**',
    redirectTo: '/overview',
    pathMatch: 'full', // Explicitly specify "full"
  },
];

export const APP_ROUTES = provideRouter(routes, withHashLocation());
