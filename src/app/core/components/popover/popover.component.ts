import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popover',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Trigger -->
    <div class="popover-trigger" (click)="togglePopover()" tabindex="0">
      <ng-content></ng-content> <!-- Content inside <app-popover> acts as the trigger -->
    </div>

    <!-- Popover Content -->
    <div class="popover-container" [ngClass]="position" *ngIf="show">
      <h3 *ngIf="popoverTitle">{{ popoverTitle }}</h3>
      <ng-container *ngIf="isTemplate(content); else plainContent">
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </ng-container>
      <ng-template #plainContent>{{ popoverContent || content }}</ng-template>
    </div>
  `,
  styles: [`
    .popover-trigger {
      cursor: pointer;
      color: #007bff;
      text-decoration: underline;
      font-size: 1rem;
      display: inline-block;
    }

    .popover-container {
      position: absolute;
      background: #fff;
      border: 1px solid #ccc;
      padding: 10px;
      border-radius: 5px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    }
  `],
})
export class PopoverComponent {
  @Input() content!: string | TemplateRef<any>;
  @Input() popoverTitle?: string;
  @Input() popoverContent?: string;
  @Input() position: 'top' | 'right' | 'bottom' | 'left' = 'top';

  show = false;

  isTemplate(content: string | TemplateRef<any>): content is TemplateRef<any> {
    return content instanceof TemplateRef;
  }

  togglePopover(): void {
    this.show = !this.show;
    console.log('Popover state:', this.show); // Debugging: Logs the popover state
  }
}
