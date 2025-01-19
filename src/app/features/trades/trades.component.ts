import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TradeFormComponent, Trade } from '../../core/components/trade-form/trade-form.component';
import { NotificationService } from '../../core/services/notifications.service';
import {PopoverComponent} from '../../core/components/popover/popover.component';

@Component({
  selector: 'app-trades',
  standalone: true,
  imports: [CommonModule, FormsModule, TradeFormComponent, PopoverComponent],
  templateUrl: './trades.component.html',
  styleUrls: ['./trades.component.scss'],
})
export class TradesComponent {
  plannedTrades: Trade[] = this.loadTradesFromLocalStorage();
  openTrades: { [symbol: string]: { quantity: number; executedPrice: number }[] } = {};
  strategies = ['A Up', 'A Down', 'Rubber Band', 'Fade', 'System Failure', 'Scalp', 'Overnight'];
  summary = { totalBuy: 0, totalSell: 0, overallProfitLoss: 0 };

  constructor(private notificationService: NotificationService) {}

  saveTradesToLocalStorage(): void {
    localStorage.setItem('plannedTrades', JSON.stringify(this.plannedTrades));
  }

  loadTradesFromLocalStorage(): Trade[] {
    const storedTrades = localStorage.getItem('plannedTrades');
    return storedTrades ? JSON.parse(storedTrades) : [];
  }

  handleTradePlanned(trade: Trade): void {
    this.plannedTrades.push({
      ...trade,
      strategy: '',
      notes: '',
      status: 'pending',
    });
    this.saveTradesToLocalStorage();
    this.calculateSummary();
    this.notificationService.showNotification('Trade planned successfully!', 'success');
  }

  executeTrade(index: number): void {
    const trade = this.plannedTrades[index];
    trade.status = 'executed';

    if (trade.action === 'buy') {
      if (!this.openTrades[trade.symbol]) this.openTrades[trade.symbol] = [];
      this.openTrades[trade.symbol].push({ quantity: trade.quantity, executedPrice: trade.price });
    } else if (trade.action === 'sell') {
      let profit = 0;
      const buys = this.openTrades[trade.symbol] || [];
      let remainingQuantity = trade.quantity;

      while (remainingQuantity > 0 && buys.length > 0) {
        const buy = buys[0];
        const matchedQuantity = Math.min(remainingQuantity, buy.quantity);

        profit += matchedQuantity * (trade.price - buy.executedPrice);
        buy.quantity -= matchedQuantity;
        remainingQuantity -= matchedQuantity;

        if (buy.quantity === 0) buys.shift();
      }

      trade.profitLoss = profit;
      this.notificationService.showNotification(`Profit/Loss: $${profit.toFixed(2)}`, 'success');
    }

    this.saveTradesToLocalStorage();
    this.calculateSummary();
    this.notificationService.showNotification('Trade executed successfully!', 'success');
  }

  deleteTrade(index: number): void {
    this.plannedTrades.splice(index, 1);
    this.saveTradesToLocalStorage();
    this.calculateSummary();
    this.notificationService.showNotification('Trade deleted successfully!', 'success');
  }

  calculateSummary(): void {
    this.summary = this.plannedTrades.reduce(
      (acc, trade) => {
        const total = trade.quantity * trade.price;
        if (trade.action === 'buy') acc.totalBuy += total;
        else if (trade.action === 'sell') acc.totalSell += total;

        acc.overallProfitLoss += trade.profitLoss || 0;
        return acc;
      },
      { totalBuy: 0, totalSell: 0, overallProfitLoss: 0 }
    );
  }
}
