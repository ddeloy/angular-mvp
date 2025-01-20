import { Routes } from '@angular/router';
import {AboutComponent} from './about.component';

export const ABOUT_ROUTES: Routes = [
  {
    path: '',
    component: AboutComponent,
    children: [
      {
        path: '',
        redirectTo: 'about-overview', // Redirect to "official-docs" by default
        pathMatch: 'full',
      },
      {
        path: 'about-overview',
        loadComponent: () =>
          import('./categories/about-overview/about-overview.component').then(
            (m) => m.AboutOverviewComponent
          ),
      },
      {
        path: 'angular-concepts',
        loadComponent: () =>
          import('./categories/angular-concepts/angular-concepts.component').then(
            (m) => m.AngularConceptsComponent
          ),
      },
      {
        path: 'app-views',
        loadComponent: () =>
          import('./categories/app-views/app-views.component').then(
            (m) => m.AppViewsComponent
          ),
      },
    ],
  },
];
