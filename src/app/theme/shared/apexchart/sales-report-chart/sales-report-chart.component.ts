// angular import
import { Component, viewChild } from '@angular/core';

// project import

// third party
import { NgApexchartsModule, ChartComponent, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-sales-report-chart',
  imports: [NgApexchartsModule],
  templateUrl: './sales-report-chart.component.html',
  styleUrl: './sales-report-chart.component.scss'
})
export class SalesReportChartComponent {
  chart = viewChild.required<ChartComponent>('chart');
  chartOptions!: Partial<ApexOptions>;

  constructor() {
    this.chartOptions = {
      chart: {
        type: 'bar',
        height: 330,
        toolbar: {
          show: false
        },
        background: 'transparent'
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
          borderRadius: 4
        }
      },
      stroke: {
        show: true,
        width: 8,
        colors: ['transparent']
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        show: true,
        fontFamily: `'Public Sans', sans-serif`,
        offsetX: 10,
        offsetY: 10,
        labels: {
          useSeriesColors: false
        },
        itemMargin: {
          horizontal: 15,
          vertical: 5
        }
      },
      series: [
        {
          name: 'Stock Issued to Contractors',
          data: [180, 90, 135, 114, 120, 145, 180]
        },
        {
          name: 'Stock Received from Contractors',
          data: [120, 45, 78, 150, 168, 99, 120]
        },
        {
          name: 'Stock Issued to Party',
          data: [140, 35, 98, 140, 180, 79, 130]
        }
      ],
      xaxis: {
        categories: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
        labels: {
          style: {
            colors: ['#222', '#222', '#222', '#222', '#222', '#222', '#222']
          }
        }
      },
      tooltip: {
        theme: 'light'
      },
      colors: ['#faad14', '#1677ff', '#ff4c16ff'],
      grid: {
        borderColor: '#f5f5f5'
      }
    };
  }
}
