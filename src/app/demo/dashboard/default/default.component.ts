// angular import
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import tableData from 'src/fake-data/default-data.json';
// icons
import { IconService } from '@ant-design/icons-angular';
import { FallOutline, GiftOutline, MessageOutline, RiseOutline, SettingOutline } from '@ant-design/icons-angular/icons';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { DataService } from 'src/app/services/data-service';
import { contractorChallanInfo } from 'src/app/model/contractorChallanInfo';
import { clientChallanInfo } from 'src/app/model/clientChallanInfo';
import { PartyReportChart } from 'src/app/theme/shared/apexchart/party-report-chart/party-report-chart';
import { ContractorReportChart } from 'src/app/theme/shared/apexchart/contractor-report-chart/contractor-report-chart';

@Component({
  selector: 'app-default',
  imports: [
    CommonModule,
    CardComponent,
    PartyReportChart,
    ContractorReportChart
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
  cardsInfourl: string = 'dashboard/cards'

  currentMonthPartyIssuedChallanCount: number = 0
  currentMonthPartyRecievedChallanCount: number = 0
  previousDayPartyIssuedChallanCount: number = 0
  previousDayPartyRecievedChallanCount: number = 0

  currentMonthContractorIssuedChallanCount: number = 0
  currentMonthContractorRecievedChallanCount: number = 0
  previousDayContractorIssuedChallanCount: number = 0
  previousDayContractorRecievedChallanCount: number = 0
  monthlyChallanCountData: any;
  yesterdayChallanCountData: any;
  clientChallanRecord: number;


  constructor() {
    this.iconService.addIcon(...[RiseOutline, FallOutline, SettingOutline, GiftOutline, MessageOutline]);
  }

  recentOrder = tableData;

  ngOnInit(): void {
    this.getClientInfoData()
    this.getContractorInfoData()
    this.getCardsInfoData()
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

  getCardsInfoData = () => {
    this.dataService.get(this.cardsInfourl)
      .subscribe((res: any) => {
        if (res.status === 'success') {
          this.currentMonthPartyIssuedChallanCount = res.data.dashboardCurrentMonthClientCardVos[0].challanCount
          this.currentMonthPartyRecievedChallanCount = res.data.dashboardCurrentMonthClientCardVos[1].challanCount
          this.previousDayPartyIssuedChallanCount = res.data.dashboardCurrentMonthClientCardVos[0].challanCount
          this.previousDayPartyRecievedChallanCount = res.data.dashboardCurrentMonthClientCardVos[0].challanCount

          this.currentMonthContractorIssuedChallanCount = res.data.dashboardPreviousDayContractorCardVos[0] ? res.data.dashboardPreviousDayContractorCardVos[0].challanCount : 0
          this.currentMonthContractorRecievedChallanCount = res.data.dashboardPreviousDayContractorCardVos[1] ? res.data.dashboardPreviousDayContractorCardVos[1].challanCount : 0
          this.previousDayContractorIssuedChallanCount = res.data.dashboardPreviousDayClientCardVos[0] ? res.data.dashboardPreviousDayClientCardVos[0].challanCount : 0
          this.previousDayContractorRecievedChallanCount = res.data.dashboardPreviousDayClientCardVos[1] ? res.data.dashboardPreviousDayClientCardVos[1].challanCount : 0
        }

        this.monthlyChallanCountData = [
          {
            title: "Challan To Party In Current Month",
            challancount: this.currentMonthPartyIssuedChallanCount
          },
          {
            title: "Challan To Contractor In Current Month",
            challancount: this.currentMonthPartyRecievedChallanCount
          },
          {
            title: 'Challan From Contractor In Current Month',
            challancount: this.previousDayPartyIssuedChallanCount
          },
          {
            title: 'Challan To Contractor In Current Month',
            challancount: this.previousDayPartyRecievedChallanCount
          }
        ];

        this.yesterdayChallanCountData = [
          {
            title: "Challan To Party On Yesterday",
            challancount: this.currentMonthContractorIssuedChallanCount
          },
          {
            title: "Challan To Contractor On Yesterday",
            challancount: this.currentMonthContractorRecievedChallanCount
          },
          {
            title: 'Challan From Contractor On Yesterday',
            challancount: this.previousDayContractorIssuedChallanCount
          },
          {
            title: 'Challan To Contractor On Yesterday',
            challancount: this.previousDayContractorRecievedChallanCount
          }
        ];
      })
  }




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
