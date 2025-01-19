import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {HeaderComponent} from './core/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HeaderComponent], // Import HeaderComponent
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
