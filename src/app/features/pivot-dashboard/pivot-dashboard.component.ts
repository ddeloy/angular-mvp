import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { fetchLast5DaysData } from '../../core/services/api'; // Adjust the import path as needed

@Component({
  selector: 'app-pivot-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pivot-dashboard.component.html',
  styleUrls: ['./pivot-dashboard.component.scss'],
})
export class PivotDashboardComponent {
  symbol = '';
  days = 9;
  stockDataMessage = '';
  rollingPivotData = '';
  dailyTable: any[] = [];
  chartInstance: Chart | null = null;

  @ViewChild('pivotChartCanvas', { static: true }) pivotChartCanvas!: ElementRef<HTMLCanvasElement>;

  async fetchData() {
    if (!this.symbol.trim()) {
      this.stockDataMessage = 'Please enter a valid stock symbol.';
      return;
    }

    this.stockDataMessage = 'Loading...';

    try {
      const { last5Days, rolling2DayPivot } = await fetchLast5DaysData(this.symbol, this.days);
      const runningSumData = this.processData(last5Days, rolling2DayPivot);
      this.renderChart(runningSumData.dates, runningSumData.avgRanges);

      this.stockDataMessage = `Data for ${this.symbol} updated successfully.`;
    } catch (error) {
      console.error('Error fetching or rendering data:', error);
      this.stockDataMessage = `Error: Unable to fetch data.`;
    }
  }

  reset() {
    this.symbol = '';
    this.days = 9;
    this.stockDataMessage = '';
    this.rollingPivotData = '';
    this.dailyTable = [];
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }

  processData(last5Days: any, rolling2DayPivot: any) {
    let runningSum = 0;
    const dates: string[] = [];
    const avgRanges: number[] = [];

    this.dailyTable = Object.entries(last5Days).map(([date, values]: any) => {
      const open = parseFloat(values.open);
      const close = parseFloat(values.close);
      const pivotLow = parseFloat(values.pivotLow);
      const pivotHigh = parseFloat(values.pivotHigh);

      let plusMinus = 0;
      if (open < pivotLow && close > pivotHigh) plusMinus = 1;
      else if (open > pivotHigh && close < pivotLow) plusMinus = -1;

      runningSum += plusMinus;

      dates.push(date);
      avgRanges.push(parseFloat(values.pivotNum));

      return {
        date,
        open: values.open,
        high: values.high,
        low: values.low,
        close: values.close,
        pivotRange: `${pivotHigh} to ${pivotLow}`,
        plusMinus,
      };
    });

    this.rollingPivotData = `
      <strong>Rolling 2-Day Pivot Diff:</strong> ${rolling2DayPivot.rollingPivotDiff} |
      <strong>Rolling Pivot Range:</strong> ${rolling2DayPivot.rollingPivotRange} |
      <strong>Running Plus/Minus:</strong> ${runningSum}
    `;

    return { dates, avgRanges };
  }

  renderChart(dates: string[], avgRanges: number[]) {
    if (this.chartInstance) this.chartInstance.destroy();

    this.chartInstance = new Chart(this.pivotChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: dates.reverse(),
        datasets: [
          {
            label: 'Pivot Num (Avg Range)',
            data: avgRanges.reverse(),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: 'Dates' } },
          y: { title: { display: true, text: 'Price' } },
        },
      },
    });
  }
}
