import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Profile {
  name: string;
  email: string;
  bio: string;
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent { }
