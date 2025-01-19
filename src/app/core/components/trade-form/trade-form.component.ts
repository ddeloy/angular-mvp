import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type Trade = {
  symbol: string;
  action: string;
  quantity: number;
  price: number;
  strategy?: string; // Add the strategy property
  notes?: string;    // Ensure notes is included
  status?: 'pending' | 'executed'; // Optional status
  profitLoss?: number; // Optional profit/loss
};


@Component({
  selector: 'app-trade-form',
  standalone: true,
  imports: [FormsModule], // Only FormsModule is needed for [(ngModel)]
  templateUrl: './trade-form.component.html',
  styleUrls: ['./trade-form.component.scss'],
})
export class TradeFormComponent {
  @Output() tradePlanned = new EventEmitter<Trade>();

  trade: Trade = {
    symbol: '',
    action: 'buy',
    quantity: 0,
    price: 0,
    notes: '', // Initialize notes as an empty string
    profitLoss: undefined, // Initialize profitLoss as undefined
  };

  validateTradeInput(): string | null {
    const { symbol, action, quantity, price } = this.trade;
    if (!symbol.match(/^[A-Za-z]+$/)) return 'Invalid stock symbol.';
    if (!['buy', 'sell'].includes(action)) return 'Invalid action. Choose Buy or Sell.';
    if (quantity <= 0) return 'Quantity must be greater than 0.';
    if (price <= 0) return 'Price must be greater than 0.';
    return null; // Validation passed
  }

  onSubmit(): void {
    const error = this.validateTradeInput();
    if (error) {
      alert(error); // Replace with better UI feedback later
      return;
    }
    this.tradePlanned.emit({ ...this.trade, status: 'pending' }); // Emit trade with initial status
    this.trade = {
      symbol: '',
      action: 'buy',
      quantity: 0,
      price: 0,
      notes: '', // Reset notes
      profitLoss: undefined, // Reset profitLoss
    }; // Reset form
  }
}
