import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [RouterModule], // Import RouterModule for routing directives
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
})
export class ResourcesComponent {
  docsLinks = [
    { title: 'Explore the Docs', link: 'https://angular.dev' },
    { title: 'Learn with Tutorials', link: 'https://angular.dev/tutorials' },
    { title: 'CLI Docs', link: 'https://angular.dev/tools/cli' },
    { title: 'Angular Language Service', link: 'https://angular.dev/tools/language-service' },
    { title: 'Angular DevTools', link: 'https://angular.dev/tools/devtools' },
  ];

  socialLinks = [
    {
      href: 'https://github.com/angular/angular',
      label: 'Github',
    },
    {
      href: 'https://twitter.com/angular',
      label: 'Twitter',
    },
    {
      href: 'https://www.youtube.com/channel/UCbn1OgGei-DV7aSRo_HaAiw',
      label: 'YouTube',
    },
  ];
}
