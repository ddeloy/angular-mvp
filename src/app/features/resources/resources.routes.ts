import { Routes } from '@angular/router';
import { ResourcesComponent } from './resources.component';

export const RESOURCES_ROUTES: Routes = [
  {
    path: '',
    component: ResourcesComponent,
    children: [
      {
        path: '',
        redirectTo: 'official-docs', // Redirect to "official-docs" by default
        pathMatch: 'full',
      },
      {
        path: 'official-docs',
        loadComponent: () =>
          import('./categories/official-docs/official-docs.component').then(
            (m) => m.OfficialDocsComponent
          ),
      },
      {
        path: 'social-media',
        loadComponent: () =>
          import('./categories/social-media/social-media.component').then(
            (m) => m.SocialMediaComponent
          ),
      },
      {
        path: 'developer-tools',
        loadComponent: () =>
          import('./categories/developer-tools/developer-tools.component').then(
            (m) => m.DeveloperToolsComponent
          ),
      },
      {
        path: 'best-practices',
        loadComponent: () =>
          import('./categories/best-practices/best-practices.component').then(
            (m) => m.BestPracticesComponent
          ),
      },
    ],
  },
];
