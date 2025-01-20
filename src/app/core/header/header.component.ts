import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true, // Ensure this is a standalone component
  imports: [RouterModule], // Import RouterModule to resolve IDE warnings
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'], // Correct plural spelling for styleUrls
})
export class HeaderComponent {
 /* clearAllData(): void {
    localStorage.clear();
    window.alert('All data has been cleared from local storage.');
  }*/
}
