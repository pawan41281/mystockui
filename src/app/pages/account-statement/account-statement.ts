import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import type { ColDef, GridReadyEvent } from "ag-grid-community";
import { GridApi } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, Observable, of, switchMap } from 'rxjs';
import { challanItems } from '../../model/challanItems';
import { contractor } from '../../model/contractor';
import { formatDate } from '@angular/common';
import { DownloadSerivceService } from 'src/app/services/download-serivce-service';
import { UtilService } from 'src/app/services/util-service';
import { DataService } from 'src/app/services/data-service';
import { requestResponse } from 'src/app/model/requestResponse';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { userData } from 'src/app/model/userData';
import { AccountStatementModel } from 'src/app/model/AccountStatementModel';
import { contractorChallan } from 'src/app/model/contractorChallan';
import { challanFilter } from 'src/app/model/challanFilter';

@Component({
  selector: 'app-account-statement',
  imports: [AgGridAngular, FormsModule, CommonModule, MatDatepickerModule,
    MatNativeDateModule, MatInputModule, NgbTypeaheadModule, CardComponent],
  templateUrl: './account-statement.html',
  styleUrl: './account-statement.scss'
})
export class AccountStatement implements OnInit {

  id: string = '';
  url: string = 'contractoraccountstatments';
  paymentUrl: string = 'contractorpayments';
  contractorChallanUrl: string = 'contractorchallans';
  totalRecord: number = 0;
  http = inject(HttpClient)
  dataService = inject(DataService)
  utilsService: UtilService = inject(UtilService);
  router: ActivatedRoute = inject(ActivatedRoute);
  route: Router = inject(Router);
  accountStatements: AccountStatementModel[] = [];
  private readonly downloadService = inject(DownloadSerivceService);
  private gridApi!: GridApi;
  contractors: contractor[] = [];
  dropdownData: contractor[] = [];
  itemDetails: challanItems[] | undefined = [];
  fromDate: Date = new Date();
  toDate: Date = new Date();
  filterObj: AccountStmtFilter = new AccountStmtFilter();
  isAdmin: boolean = false;
  userInfo: userData;
  invalidDateRange: boolean = false;
  errorMessage: string = '';
  conctractorId: number = 0;
  challanItemDetails: challanItems[] | undefined = [];
  contractorChallans: contractorChallan[] = [];
  paymentFilterObj: PaymentFilter = new PaymentFilter();

  constructor() {
    this.getClients();
  }

  ngOnInit() {

    this.searchAccountStatement()
    this.userInfo = this.utilsService.getCurrentUserInfo()
    this.isAdmin = this.userInfo.roles.filter(e => e.adminrole).length > 0
    this.searchContractorChallan()
    this.searchContractorPayment()
  }

  searchContractorPayment = () => {

    this.paymentFilterObj.frompaymentdate = this.fromDate && !this.utilsService.isValidDateFormat(this.fromDate.toString()) ? this.utilsService.formatDate_dd_MM_YYYY(this.fromDate) : '';
    this.paymentFilterObj.topaymentdate = this.toDate && !this.utilsService.isValidDateFormat(this.fromDate.toString()) ? this.utilsService.formatDate_dd_MM_YYYY(this.toDate) : '';
    let url = '';
    url = this.paymentUrl + this.utilsService.buildUrl(this.paymentFilterObj);
    this.dataService.get(url)
      .subscribe((res: requestResponse) => {
        this.contractorChallans = res.data;
        // this.contractorChallans.forEach(e1 => { e1.challanType = this.utilsService.challanTypes?.find(e => e.val === e1.challanType)?.name ?? '' })
        this.totalRecord = res.metadata.recordcount;
      })
  }

  searchContractorChallan = () => {

    this.filterObj.fromchallandate = this.fromDate && !this.utilsService.isValidDateFormat(this.fromDate.toString()) ? this.utilsService.formatDate_dd_MM_YYYY(this.fromDate) : '';
    this.filterObj.tochallandate = this.toDate && !this.utilsService.isValidDateFormat(this.fromDate.toString()) ? this.utilsService.formatDate_dd_MM_YYYY(this.toDate) : '';
    let url = '';
    url = this.contractorChallanUrl + this.utilsService.buildUrl(this.filterObj);
    this.dataService.get(url)
      .subscribe({
        next: (res: requestResponse) => {
          this.contractorChallans = res.data;
          this.contractorChallans.forEach(e1 => {
            e1.challanType = this.utilsService.challanTypes?.find(e => e.val === e1.challanType)?.name ?? '';
          });
          this.totalRecord = res.metadata.recordcount;
        },
        error: (err) => {
          this.invalidDateRange = false;
          if (err.status === 400) {
            // Handle 400 Bad Request
            console.error('Bad Request:', err.message);
            this.errorMessage = err.message;
          }

        }


        // (res: requestResponse) => {
        // this.contractorChallans = res.data;
        // this.contractorChallans.forEach(e1 => { e1.challanType = this.utilsService.challanTypes?.find(e => e.val === e1.challanType)?.name ?? '' })
        // this.totalRecord = res.metadata.recordcount;
      })
  }

  getClients = () => {
    this.dataService.get('contractors')
      .subscribe((res: requestResponse) => {
        this.contractors = res.data;
        this.dropdownData = this.contractors;
      })
  }

  colDefs: ColDef<AccountStatementModel>[] = [
    {
      headerName: "Contractor",
      field: "contractorName",
    },
    {
      headerName: "Work Done",
      field: 'workDoneAmount'
    },
    {
      headerName: "Paid Amount",
      field: "paymentDoneAmount",
    },
    {
      headerName: "Pending Amount",
      cellRenderer: this.calculateAmount
    },
    {
      headerName: '',
      cellClass: 'align-center',
      sortable: false,
      filter: false,
      cellRenderer: this.myCellRendererAction.bind(this),
      onCellClicked: (event) => {
        this.conctractorId = event.data?.contractorId;
      }
    }];


  myCellRendererAction(params: any) {
    this.id = params.node.data.id;


    return `<img src="assets/images/find.png" style="width: 20px; height: 20px;" (click)="searchContractorChallan()" data-bs-toggle="modal" data-bs-target="#exampleModal">`;

  }


  renderDate(params: any) {
    return formatDate(params.node.data.challanDate, 'dd-MM-yyyy', 'en-US');
  }


  calculateAmount(params: any) {
    return params.node.data.workDoneAmount - params.node.data.paymentDoneAmount;;
  }


  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    filter: true,

  };


  searchAccountStatement = () => {

    this.filterObj.fromchallandate = this.fromDate && !this.utilsService.isValidDateFormat(this.fromDate.toString()) ? this.utilsService.formatDate_dd_MM_YYYY(this.fromDate) : '';
    this.filterObj.tochallandate = this.toDate && !this.utilsService.isValidDateFormat(this.fromDate.toString()) ? this.utilsService.formatDate_dd_MM_YYYY(this.toDate) : '';
    let url = '';
    url = this.url + this.utilsService.buildUrl(this.filterObj);
    this.dataService.get(url)
      .subscribe({
        next: (res: requestResponse) => {
          this.accountStatements = res.data;
          this.totalRecord = res.metadata.recordcount;
        },
        error: (err) => {
          this.invalidDateRange = false;
          if (err.status === 400) {
            // Handle 400 Bad Request
            console.error('Bad Request:', err.message);
            this.errorMessage = err.message;
          }

        }
      })
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term =>
        term.length < 2 ? of([]) : this.http.get<contractor[]>(`contractors/?contractorName=${term}`)
      )
    );

  formatter = (result: any) => result.clientName;

  filterData(event: any) {
    this.dropdownData = this.contractors.filter(e => e.contractorName.includes(event.target.value.toUpperCase()))
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }


  //=================Items details =============

  itemDetailsColDefs: ColDef<challanItems>[] = [
    {
      headerName: "Challan Date",
      field: "design.designName",
    },
    {
      headerName: "Challan Number",
      field: "quality.qualityName",
    },
    {
      headerName: "Quality",
      field: "quality.qualityName",
    },
    {
      headerName: "Design",
      field: "design.designName",
    },
    {
      headerName: "Color",
      field: "color.colorName",
    },
    {
      headerName: "Quantity",
      field: "quantity",
    },
    {
      headerName: "Rate",
      field: "rate",
    }
  ];

  onBtnExport() {
    this.downloadService.exportToCSV(this.getReportData(), 'account_statements_data.csv')
  }

  onBtnExportExcel() {
    this.downloadService.exportToExcel(this.getReportData(), 'account_statements_data.xlsx')
  }

  getReportData() {
    return this.accountStatements.map(e => ({

      'Contractor Name': e.contractorName,
      'From Date': e.fromDate,
      'To Date': e.toDate,
      'Worked Amount': e.workDoneAmount,
      'Paid Amount': e.paymentDoneAmount,
      'Pending Amount': e.workDoneAmount - e.paymentDoneAmount
    }));
  }

  formatDate(event: any) {
    const [day, month, year] = formatDate(event.value, 'dd-MM-yyyy', 'en-US').split('-').map(Number);
    const dateObj = new Date(year, month - 1, day)
    this.fromDate = dateObj;
  }

}

class AccountStmtFilter {
  contractorid: string;
  fromchallandate: string;
  tochallandate: string;

  constructor() {
    this.contractorid = '';
    this.fromchallandate = '';
    this.tochallandate = '';

  }
}


class PaymentFilter {
  contractorid: string;
  frompaymentdate: string;
  topaymentdate: string;
  constructor() {
    this.contractorid = '';
    this.frompaymentdate = '';
    this.topaymentdate = '';
  }
}