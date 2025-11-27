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
import { contractorpayment } from 'src/app/model/contractorpayment';

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
  challanCount: number = 0
  paymentCount: number = 0
  http = inject(HttpClient)
  dataService = inject(DataService)
  utilsService: UtilService = inject(UtilService);
  router: ActivatedRoute = inject(ActivatedRoute);
  route: Router = inject(Router);
  accountStatements: AccountStatementModel[] = [];
  private readonly downloadService = inject(DownloadSerivceService);
  private gridApi!: GridApi;
  contractors: contractor[] = [];
  contractorList: contractor[] = [];
  itemDetails: challanItems[] | undefined = [];
  now = new Date();
  fromDate: Date = new Date(this.now.getFullYear(), this.now.getMonth(), 1);
  toDate: Date = new Date();
  filterObj: AccountStmtFilter = new AccountStmtFilter();
  isAdmin: boolean = false;
  userInfo: userData;
  invalidDateRange: boolean = false;
  errorMessage: string = '';
  showAccountStatement: boolean = false
  showChallans: boolean = false
  showPayments: boolean = false
  challanItemDetails: challanItems[] | undefined = [];
  contractorChallans: contractorChallan[] = [];
  contractorPayments: contractorpayment[] = [];
  contractorId: string = ''

  constructor() {
    this.getContractors();
  }

  ngOnInit() {
    //this.searchAccountStatement()
    this.userInfo = this.utilsService.getCurrentUserInfo()
    this.isAdmin = this.userInfo.roles.filter(e => e.adminrole).length > 0
  }

  getContractorName(id: string) {
    return this.contractorList.find(e => e.id + '' === id).contractorName
  }

  searchContractorPayment = () => {

    this.filterObj.fromDate = this.utilsService.dateFromate_dd_MM_YY(this.fromDate);
    this.filterObj.toDate = this.utilsService.dateFromate_dd_MM_YY(this.toDate);

    let url = '';
    url = this.paymentUrl + this.utilsService.buildUrl(this.filterObj);
    this.dataService.get(url)
      .subscribe((res: requestResponse) => {
        this.contractorPayments = res.data;
        // this.contractorPayments.forEach(e1 => { e1.challanType = this.utilsService.challanTypes?.find(e => e.val === e1.challanType)?.name ?? '' })
        this.paymentCount = res.metadata.recordcount;
      })
  }

  searchContractorChallan = (id: number) => {

    this.filterObj.fromDate = this.utilsService.dateFromate_dd_MM_YY(this.fromDate); // this.fromDate && !this.utilsService.isValidDateFormat(this.fromDate.toString()) ? this.utilsService.formatDate_dd_MM_YYYY(this.fromDate) : '';
    this.filterObj.toDate = this.utilsService.dateFromate_dd_MM_YY(this.toDate);  //this.toDate && !this.utilsService.isValidDateFormat(this.fromDate.toString()) ? this.utilsService.formatDate_dd_MM_YYYY(this.toDate) : '';
    this.filterObj.contractorid = id.toString()
    let url = '';
    url = this.contractorChallanUrl + this.utilsService.buildUrl(this.filterObj);
    this.dataService.get(url)
      .subscribe({
        next: (res: requestResponse) => {
          this.contractorChallans = res.data;
          this.contractorChallans.forEach(e1 => {
            e1.challanType = this.utilsService.challanTypes?.find(e => e.val === e1.challanType)?.name ?? '';
          });
          this.challanCount = res.metadata.recordcount;
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


  getContractors = () => {
    this.dataService.get('contractors')
      .subscribe((res: requestResponse) => {
        this.contractors = res.data;
        this.contractorList = this.contractors;
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
        const id = event.data.contractorId;
        this.searchContractorChallan(id);
        this.searchContractorPayment();
        this.showAccountStatement = false
        this.showPayments = true
        this.showChallans = true
      }
    }];

  myCellRendererAction() {
    return '<img src="assets/images/find.png" style="width: 20px; height: 20px;" data-bs-toggle="modal" data-bs-target="#exampleModal">';
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
    this.showChallans = false
    this.showPayments = false
    this.filterObj.fromDate = this.utilsService.dateFromate_dd_MM_YY(this.fromDate);// this.fromDate && !this.utilsService.isValidDateFormat(this.fromDate.toString()) ? this.utilsService.formatDate_dd_MM_YYYY(this.fromDate) : '';
    this.filterObj.toDate = this.utilsService.dateFromate_dd_MM_YY(this.toDate); //this.toDate && !this.utilsService.isValidDateFormat(this.fromDate.toString()) ? this.utilsService.formatDate_dd_MM_YYYY(this.toDate) : '';
    this.filterObj.contractorid = this.contractorId

    let url = '';
    url = this.url + this.utilsService.buildUrl(this.filterObj);
    this.dataService.get(url)
      .subscribe({
        next: (res: requestResponse) => {
          this.accountStatements = res.data;
          //this.contractorId = this.accountStatements.contractorId
          this.totalRecord = res.metadata.recordcount;
          this.showAccountStatement = true
        },
        error: (err) => {
          this.invalidDateRange = false;
          if (err.status === 400) {
            // Handle 400 Bad Request
            console.error('Bad Request:', err.message);
            this.errorMessage = err.message;
            this.showAccountStatement = false
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
    this.contractorList = this.contractors.filter(e => e.contractorName.includes(event.target.value.toUpperCase()))
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }


  //=================Items details =============

  // Column Definitions: Defines & controls grid columns.
  challanDetailsColDefs: ColDef<contractorChallan>[] = [
    {
      headerName: "Challan Number",
      field: "challanNumber",
    },
    {
      headerName: "Challan Date",
      cellRenderer: this.renderDate
    },
    {
      headerName: "Contractor Name",
      field: "contractor.contractorName",
    },
    {
      headerName: "Challan Type",
      field: 'challanType'
    },
    {
      headerName: "Pices Count",
      cellRenderer: this.myItemCellRenderer
    },
    {
      headerName: "Amount",
      cellRenderer: this.calculateChallanAmount
    },
    {
      headerName: '',
      sortable: false,
      filter: false,
      cellRenderer: this.myCellRendererChallanAction.bind(this),
      onCellClicked: (event) => {
        this.itemDetails = event.data?.challanItems;
        //console.log('item details ', this.itemDetails)
      }
    }
  ];


  paymentColDefs: ColDef<contractorpayment>[] = [

    {
      headerName: "Payment Date",
      cellRenderer: this.renderPaymentDate
    },
    {
      headerName: "Contractor Name",
      field: "contractor.contractorName",
    },
    {
      headerName: "Payment Amount",
      field: "paymentAmount"
    },
    {
      headerName: "Remarks",
      field: "remarks"
    }
  ];


  renderPaymentDate(params: any) {
    return formatDate(params.node.data.paymentDate, 'dd-MM-yyyy', 'en-US');
  }
  calculateChallanAmount(params: any) {
    let totalAmount = 0;
    params.node.data.challanItems.forEach((e: { rate: number, quantity: number; }) => totalAmount += (e.rate * e.quantity));
    return `<span>${totalAmount}</span>`;
  }

  myCellRendererChallanAction(params: any) {
    this.id = params.node.data.id;
    console.log('this.isAdmin ', this.isAdmin)
    return `<div style="text-align: right">
         <img src="assets/images/find.png" style="width: 20px; height: 20px;" (click)="searchContractorChallan()" data-bs-toggle="modal" data-bs-target="#challanItemsModel">         
       
       </div>`
  }



  myItemCellRenderer(params: any) {
    let totalQuantity = 0;
    params.node.data.challanItems.forEach((e: { quantity: number; }) => totalQuantity += e.quantity);
    return `<span>${totalQuantity}</span>`;
  }



  getTotal(value: any) {
    console.log('data :: ', value.data)

    return `<img src="assets/images/find.png" style="width: 20px; height: 20px;" data-bs-toggle="modal" data-bs-target="#exampleModal">`;
  }


  //------------- For Challan Items -------------------

  itemDetailsColDefs: ColDef<challanItems>[] = [
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

  //---------------------------------------------------

  onBtnExport() {
    this.downloadService.exportToCSV(this.getReportData(), 'account_statements_data.csv')
  }

  onBtnExportExcel() {
    this.downloadService.exportToExcel(this.getReportData(), 'account_statements_data.xlsx')
  }

  hideStatement() {
    this.accountStatements = []
    this.totalRecord = 0
    this.showAccountStatement = false
  }

  hideChallans() {
    this.showAccountStatement = true
    this.showChallans = false
  }

  hidePayments() {
    this.showAccountStatement = true
    this.showPayments = false
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
  contractorid: string
  fromDate: string
  toDate: string
  challantype: string


  constructor() {
    this.contractorid = ''
    this.fromDate = ''
    this.toDate = ''
    this.challantype = 'R'
  }
}
