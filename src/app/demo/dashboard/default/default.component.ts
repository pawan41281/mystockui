// angular import
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import tableData from 'src/fake-data/default-data.json';
import { SalesReportChartComponent } from 'src/app/theme/shared/apexchart/sales-report-chart/sales-report-chart.component';

// icons
import { IconService } from '@ant-design/icons-angular';
import { FallOutline, GiftOutline, MessageOutline, RiseOutline, SettingOutline } from '@ant-design/icons-angular/icons';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { DataService } from 'src/app/services/data-service';
import { contractorChallanInfo } from 'src/app/model/contractorChallanInfo';
import { clientChallanInfo } from 'src/app/model/clientChallanInfo';
import { graphs } from 'src/app/model/graphs';

@Component({
  selector: 'app-default',
  imports: [
    CommonModule,
    CardComponent,
    SalesReportChartComponent
  ],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  private iconService = inject(IconService);
  private dataService = inject(DataService)

  contractorChallanIssuedInfoList: contractorChallanInfo[] = [];
  contractorChallanRecievedInfoList: contractorChallanInfo[] = [];
  clientChallanInfoRecieveList: clientChallanInfo[] = [];
  clientChallanInfoIssueList: clientChallanInfo[] = [];
  clientChallanInfourl: string = 'dashboard/clients/challans/challantype'
  contractorChallanInfourl: string = 'dashboard/contractors/challans/challantype'

  clientChallanRecord: number;


  constructor() {
    this.iconService.addIcon(...[RiseOutline, FallOutline, SettingOutline, GiftOutline, MessageOutline]);
  }

  recentOrder = tableData;

  ngOnInit(): void {
    this.getClientInfoData()
    this.getContractorInfoData()
  }

  getClientInfoData = () => {
    this.dataService.get(this.clientChallanInfourl)
      .subscribe((res: any) => {

        if (res.status === 'success') {
          res.data.forEach(e => {
            if (e.challanType === 'R') {
              this.getQuantinty(e)
              this.clientChallanInfoRecieveList.push(e)
            } else {
              this.getQuantinty(e)
              this.clientChallanInfoIssueList.push(e)
            }
          })
          this.clientChallanRecord = res.metadata.recordcount
        }

      })
  }

  getQuantinty(e: any) {
    let quantity = 0;
    e.challanItems.forEach(c => quantity += c.quantity)
    e.quantity = quantity;
  }

  getContractorInfoData = () => {
    this.dataService.get(this.contractorChallanInfourl)
      .subscribe((res: any) => {
        if (res.status === 'success') {
          res.data.forEach(e => {
            if (e.challanType === 'R') {
              this.getQuantinty(e)
              this.contractorChallanRecievedInfoList.push(e)
            } else {
              this.getQuantinty(e)
              this.contractorChallanIssuedInfoList.push(e)
            }
          })
          this.clientChallanRecord = res.metadata.recordcount
        }

      })
  }


  monthlyChallanCountData = [
    {
      title: "Challan To Party In Current Month",
      challancount: '236'
    },
    {
      title: "Challan To Contractor In Current Month",
      challancount: '250'
    },
    {
      title: 'Challan From Contractor In Current Month',
      challancount: '100'
    },
    {
      title: 'Challan To Contractor In Current Month',
      challancount: '100'
    }
  ];

  yesterdayChallanCountData = [
    {
      title: "Challan To Party On Yesterday",
      challancount: '16'
    },
    {
      title: "Challan To Contractor On Yesterday",
      challancount: '20'
    },
    {
      title: 'Challan From Contractor On Yesterday',
      challancount: '12'
    },
    {
      title: 'Challan To Contractor On Yesterday',
      challancount: '12'
    }
  ];

  transaction = [
    {
      background: 'text-success bg-light-success',
      icon: 'gift',
      title: 'Order #002434',
      time: 'Today, 2:00 AM',
      amount: '+ $1,430',
      percentage: '78%'
    },
    {
      background: 'text-primary bg-light-primary',
      icon: 'message',
      title: 'Order #984947',
      time: '5 August, 1:45 PM',
      amount: '- $302',
      percentage: '8%'
    },
    {
      background: 'text-danger bg-light-danger',
      icon: 'setting',
      title: 'Order #988784',
      time: '7 hours ago',
      amount: '- $682',
      percentage: '16%'
    }
  ];
}
