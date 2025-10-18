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
import { dashboardCard } from 'src/app/model/dashboardCard';
import { RouterModule } from '@angular/router';
import { requestResponse } from 'src/app/model/requestResponse';

@Component({
  selector: 'app-default',
  imports: [
    CommonModule,
    CardComponent,
    PartyReportChart,
    RouterModule,
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

  monthlyChallanCountData: any;
  yesterdayChallanCountData: any;
  clientChallanRecord: number;

  cardsData: dashboardCard;

  constructor() {
    this.iconService.addIcon(...[RiseOutline, FallOutline, SettingOutline, GiftOutline, MessageOutline]);
  }

  recentOrder = tableData;

  ngOnInit(): void {
    this.getCurrentUserInfo();
    this.getClientInfoData()
    this.getContractorInfoData()
    this.getCardsInfoData()
  }
  getCurrentUserInfo = () => {
    this.dataService.post('users/currentuser', null)
      .subscribe((res: requestResponse) => {
        if (res.status === 'success') {
          localStorage.setItem('userInfo', JSON.stringify(res.data));
        } else {
          console.error('in fetch user failure sections')
        }
      })
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
    const today = new Date();
    const monthStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

    this.dataService.get(this.cardsInfourl)
      .subscribe((res: any) => {
        if (res.status === 'success') {
          this.cardsData = res.data;
        }

        this.monthlyChallanCountData = [
          {
            title: "Challan Issue To Party In Current Month",
            challanLink: {
              url: '/partychallanregister',
              queryParams: {
                challanType: 'I',
                fromDate: monthStartDate,
                toDate: monthEndDate
              }
            },
            challancount: this.getChallanCount(this.cardsData.dashboardCurrentMonthClientCardVos[0])
          },
          {
            title: "Challan Recieved From Party In Current Month", challanLink: {
              challanLink: {
                url: '/partychallanregister',
                queryParams: {
                  challanType: 'R',
                  fromDate: monthStartDate,
                  toDate: monthEndDate
                }
              },
            },
            challancount: this.getChallanCount(this.cardsData.dashboardCurrentMonthClientCardVos[1])
          },
          {
            title: 'Challan Issue To Contractor In Current Month',
            challanLink: {
              url: '/contractorchallanregister',
              queryParams: {
                challanType: 'I',
                fromDate: monthStartDate,
                toDate: monthEndDate
              }
            },
            challancount: this.getChallanCount(this.cardsData.dashboardCurrentMonthContractorCardVos[0])
          },
          {
            title: 'Challan Recieved From Contractor In Current Month',
            challanLink: {
              url: '/contractorchallanregister',
              queryParams: {
                challanType: 'R',
                fromDate: monthStartDate,
                toDate: monthEndDate
              }
            },
            challancount: this.getChallanCount(this.cardsData.dashboardCurrentMonthContractorCardVos[1])
          }
        ];

        this.yesterdayChallanCountData = [

          {
            title: "Challan Issue To Party On Yesterday",
            challanLink: {
              url: '/partychallanregister',
              queryParams: {
                challanType: 'I',
                fromDate: yesterday,
                toDate: today
              }
            },
            challancount: this.getChallanCount(this.cardsData.dashboardPreviousDayContractorCardVos[0])
          },
          {
            title: "Challan Recieved From Party On Yesterday",
            challanLink: {
              url: '/partychallanregister',
              queryParams: {
                challanType: 'R',
                fromDate: yesterday,
                toDate: today
              }
            },
            challancount: this.getChallanCount(this.cardsData.dashboardPreviousDayContractorCardVos[1])
          },
          {
            title: 'Challan Issue To Contractor On Yesterday',
            challanLink: {
              url: '/contractorchallanregister',
              queryParams: {
                challanType: 'I',
                fromDate: yesterday,
                toDate: today
              }
            },
            challancount: this.getChallanCount(this.cardsData.dashboardPreviousDayClientCardVos[0])
          },
          {
            title: 'Challan Recieved From Contractor On Yesterday',
            challanLink: {
              url: '/contractorchallanregister',
              queryParams: {
                challanType: 'R',
                fromDate: yesterday,
                toDate: today
              }
            },
            challancount: this.getChallanCount(this.cardsData.dashboardPreviousDayClientCardVos[1])
          }
        ];
      })
  }

  getChallanCount = (data) => { return data ? data.challanCount : 0 }




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
