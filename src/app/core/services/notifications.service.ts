import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly container: HTMLElement | null;

  constructor() {
    this.container = document.querySelector('#notification-container');
    if (!this.container) {
      console.error('Notification container not found!');
    }
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    if (!this.container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    this.container.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}
