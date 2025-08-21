import { Component, inject, viewChild } from '@angular/core';
import { NgApexchartsModule, ChartComponent, ApexOptions } from 'ng-apexcharts';
import { graphs } from 'src/app/model/graphs';
import { DataService } from 'src/app/services/data-service';

@Component({
  selector: 'app-contractor-report-chart',
  imports: [NgApexchartsModule],
  templateUrl: './contractor-report-chart.html',
  styleUrl: './contractor-report-chart.scss'
})
export class ContractorReportChart {

  chart = viewChild.required<ChartComponent>('chart');
  contractorChartOptions!: Partial<ApexOptions>;
  private dataService = inject(DataService)
  graphData: graphs[] = []
  graphsUrlInfo: string = 'dashboard/graphs'
  partyDateArr = [];
  partyIssueQuentity = []
  partyRecieveQuentity = []

  contractorDateArr = [];
  contractorIssueQuentity = []
  contractorRecieveQuentity = []

  constructor() {

    this.contractorChartOptions = {
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
          data: this.contractorIssueQuentity// [180, 90, 135, 114, 120, 145, 180]
        },
        {
          name: 'Stock Received from Contractors',
          data: this.contractorRecieveQuentity
        }
      ],
      xaxis: {
        categories: this.contractorDateArr, // ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
        labels: {
          style: {
            colors: ['#222', '#222', '#222', '#222', '#222', '#222', '#222']
          }
        }
      },
      tooltip: {
        theme: 'light'
      },
      colors: ['#faad14', '#1677ff'],
      grid: {
        borderColor: '#f5f5f5'
      }
    };
  }


  ngOnInit(): void {
    this.getGraphsData()
  }
  getGraphsData = () => {
    this.dataService.get(this.graphsUrlInfo)
      .subscribe((res: any) => {

        if (res.status === 'success') {
          this.graphData = res;
          res.data.dashboardContractorGraphVos.forEach(e => {
            this.contractorDateArr.push(e.challanDate);
            this.contractorIssueQuentity.push(e.issuedQuantity);
            this.contractorRecieveQuentity.push(e.receivedQuantity);
          })
        }
      })
  }

}
