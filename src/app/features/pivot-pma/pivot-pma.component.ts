import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Required for ngModel
import { Chart, registerables, Plugin, Scale } from 'chart.js';
import { fetchLast5DaysData } from '../../core/services/api'; // Adjust path if necessary

@Component({
  selector: 'app-pivot-pma',
  standalone: true, // Use standalone component
  imports: [FormsModule], // Import FormsModule for ngModel
  templateUrl: './pivot-pma.component.html',
  styleUrls: ['./pivot-pma.component.scss'],
})
export class PivotPmaComponent implements OnInit, OnDestroy {
  public symbol: string = ''; // Two-way binding for stock symbol
  public trendInsights: string = ''; // Market trend insights
  chartInstance: Chart | null = null;

  private verticalLinePlugin: Plugin<'line'> = {
    id: 'verticalLinePlugin',
    afterDraw: (chart) => {
      const { ctx, scales } = chart;
      const highs: number[] = chart.data.datasets[3]?.data as number[] || [];
      const lows: number[] = chart.data.datasets[4]?.data as number[] || [];
      const closes: number[] = chart.data.datasets[5]?.data as number[] || [];

      if (!highs.length || !lows.length || !closes.length) return;

      ctx.save();
      highs.forEach((high, i) => {
        const low = lows[i];
        const close = closes[i];

        const x = (scales['x'] as Scale).getPixelForValue(i);
        const yHigh = (scales['y'] as Scale).getPixelForValue(high);
        const yLow = (scales['y'] as Scale).getPixelForValue(low);
        const yClose = (scales['y'] as Scale).getPixelForValue(close);

        if (!isNaN(x) && !isNaN(yHigh) && !isNaN(yLow) && !isNaN(yClose)) {
          // Draw high/low line
          ctx.strokeStyle = 'gray';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, yHigh);
          ctx.lineTo(x, yLow);
          ctx.stroke();

          // Draw close marker
          ctx.fillStyle = 'black';
          const markerSize = 4;
          ctx.beginPath();
          ctx.rect(x - markerSize / 2, yClose - markerSize / 2, markerSize, markerSize);
          ctx.fill();
        }
      });
      ctx.restore();
    },
  };

  constructor() {
    // Register Chart.js components and plugins
    Chart.register(...registerables, this.verticalLinePlugin);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.reset();
  }

  public async fetchData(): Promise<void> {
    if (!this.symbol.trim()) {
      alert('Please enter a valid stock symbol.');
      return;
    }

    try {
      const data = await fetchLast5DaysData(this.symbol.trim().toUpperCase(), 100);
      const allDates = Object.keys(data.last5Days).reverse();
      const allPivotNums = Object.values(data.last5Days).map((d) => parseFloat(d.pivotNum)).reverse();
      const highs = Object.values(data.last5Days).map((d) => parseFloat(d.high)).reverse();
      const lows = Object.values(data.last5Days).map((d) => parseFloat(d.low)).reverse();
      const closes = Object.values(data.last5Days).map((d) => parseFloat(d.close)).reverse();

      const dates = allDates.slice(-50);
      const pivotNums14 = this.calculateMovingAverage(allPivotNums, 14).slice(-50);
      const pivotNums30 = this.calculateMovingAverage(allPivotNums, 30).slice(-50);
      const pivotNums50 = this.calculateMovingAverage(allPivotNums, 50).slice(-50);

      this.trendInsights = `Current Market Trend: ${this.classifyTrend(pivotNums14, pivotNums30, pivotNums50)}`;

      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      const ctx = document.getElementById('pivot-chart') as HTMLCanvasElement;

      this.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [
            {
              label: '14-Day Pivot Num Avg',
              data: pivotNums14,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.1)',
              borderWidth: 2,
              tension: 0.4,
              pointRadius: 2,
              pointHoverRadius: 3,
            },
            {
              label: '30-Day Pivot Num Avg',
              data: pivotNums30,
              borderColor: 'rgba(192, 75, 75, 1)',
              backgroundColor: 'rgba(192, 75, 75, 0.1)',
              borderWidth: 2,
              tension: 0.4,
              pointRadius: 2,
              pointHoverRadius: 3,
            },
            {
              label: '50-Day Pivot Num Avg',
              data: pivotNums50,
              borderColor: 'rgba(75, 75, 192, 1)',
              backgroundColor: 'rgba(75, 75, 192, 0.1)',
              borderWidth: 2,
              tension: 0.4,
              pointRadius: 2,
              pointHoverRadius: 3,
            },
            {
              label: 'Highs',
              data: highs.slice(-50),
              borderColor: 'rgba(0, 0, 0, 0.1)',
              borderWidth: 1,
            },
            {
              label: 'Lows',
              data: lows.slice(-50),
              borderColor: 'rgba(0, 0, 0, 0.1)',
              borderWidth: 1,
            },
            {
              label: 'Closes',
              data: closes.slice(-50),
              borderColor: 'rgba(0, 0, 0, 0.1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              mode: 'index',
            },
          },
          scales: {
            x: { type: 'category', title: { display: true, text: 'Dates' } },
            y: { title: { display: true, text: 'Pivot Num' } },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching or rendering data:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unable to fetch data.'}`);
    }
  }

  public reset(): void {
    this.symbol = '';
    this.trendInsights = '';
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }

  private calculateMovingAverage(data: number[], windowSize: number): number[] {
    return data.map((_, index) =>
      index + 1 < windowSize
        ? NaN
        : data.slice(index + 1 - windowSize, index + 1).reduce((sum, value) => sum + value, 0) / windowSize
    );
  }

  private classifyTrend(pivot14: number[], pivot30: number[], pivot50: number[]): string {
    const slope14 = pivot14[pivot14.length - 1] - pivot14[pivot14.length - 2];
    const slope30 = pivot30[pivot30.length - 1] - pivot30[pivot30.length - 2];
    const slope50 = pivot50[pivot50.length - 1] - pivot50[pivot50.length - 2];

    if (slope14 > 0 && slope30 > 0 && slope50 > 0) return 'Bullish - All averages are rising.';
    if (slope14 < 0 && slope30 < 0 && slope50 < 0) return 'Bearish - All averages are falling.';
    if (Math.abs(slope14) < 0.1 && Math.abs(slope30) < 0.1 && Math.abs(slope50) < 0.1) return 'Neutral - Averages are flat.';
    return 'Divergent - Possible trend reversal.';
  }
}
