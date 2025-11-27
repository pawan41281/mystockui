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
import { contractorpayment } from 'src/app/model/contractorpayment';

@Component({
  selector: 'app-payment-register',
  imports: [AgGridAngular, FormsModule, CommonModule, MatDatepickerModule,
    MatNativeDateModule, MatInputModule, NgbTypeaheadModule, CardComponent],
  templateUrl: './payment-register.html',
  styleUrl: './payment-register.scss'
})
export class PaymentRegister {


  id: string = '';
  url: string = 'contractorpayments';
  totalRecord: number = 0;
  http = inject(HttpClient)
  dataService = inject(DataService)
  utilsService: UtilService = inject(UtilService);
  router: ActivatedRoute = inject(ActivatedRoute);
  route: Router = inject(Router);
  contractorPayments: contractorpayment[] = [];
  contractorChallanObj: contractorpayment = new contractorpayment();
  private readonly downloadService = inject(DownloadSerivceService);
  private gridApi!: GridApi;
  contractors: contractor[] = [];
  dropdownData: contractor[] = [];
  itemDetails: challanItems[] | undefined = [];
  fromDate: Date = new Date();
  toDate: Date = new Date();
  filterObj: challanFilter = new challanFilter();
  isAdmin: boolean = false;
  userInfo: userData;

  constructor() {
    this.getClients();
  }

  ngOnInit() {
    // this.router.queryParams.subscribe(params => {
    //   if (params['challanType']) {
    //     this.fromDate = new Date(params['fromDate']);
    //     this.toDate = new Date(params['toDate']);
    //   }

    // });
    this.searchContractorPayment()
    this.userInfo = this.utilsService.getCurrentUserInfo()
    this.isAdmin = this.userInfo.roles.filter(e => e.adminrole).length > 0
  }

  getClients = () => {
    this.dataService.get('contractors')
      .subscribe((res: requestResponse) => {
        this.contractors = res.data;
        this.dropdownData = this.contractors;
      })
  }

  getClientData = () => {
    this.dataService.get(this.url)
      .subscribe((res: requestResponse) => {
        this.contractorPayments = res.data;
        this.totalRecord = res.metadata.recordcount
      })

  }

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<contractorpayment>[] = [

    {
      headerName: "Payment Date",
      cellRenderer: this.renderDate
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
    },
    {
      headerName: '',
      sortable: false,
      filter: false,
      cellRenderer: this.myCellRendererAction.bind(this),

    }
  ];

  renderDate(params: any) {
    return formatDate(params.node.data.paymentDate, 'dd-MM-yyyy', 'en-US');
  }


  myCellRenderer(params: any) {
    let totalQuantity = 0;
    params.node.data.challanItems.forEach((e: { quantity: number; }) => totalQuantity += e.quantity);
    return `<span>${totalQuantity}</span>`;
  }

  myCellRendererAction(params: any) {
    this.id = params.node.data.id;
    return this.isAdmin ? ` <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#deleteModal"> <i class="bi bi-trash"></i> </button>` : ``;
  }

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    filter: true,

  };

  deletePayment() {
    this.dataService.delete(`${this.url}/${this.id}`)
      .subscribe((res: requestResponse) => {
        this.contractorPayments = res.data;
        this.totalRecord = res.metadata.recordcount;
        this.searchContractorPayment()
      })

  }

  searchContractorPayment = () => {

    this.filterObj.fromDate = this.utilsService.dateFromate_dd_MM_YY(this.fromDate);// this.fromDate && !this.utilsService.isValidDateFormat(this.fromDate.toString()) ? this.utilsService.formatDate_dd_MM_YYYY(this.fromDate) : '';
    this.filterObj.toDate = this.utilsService.dateFromate_dd_MM_YY(this.toDate);// this.toDate && !this.utilsService.isValidDateFormat(this.fromDate.toString()) ? this.utilsService.formatDate_dd_MM_YYYY(this.toDate) : '';
    let url = '';
    url = this.url + this.utilsService.buildUrl(this.filterObj);
    this.dataService.get(url)
      .subscribe((res: requestResponse) => {
        this.contractorPayments = res.data;
        // this.contractorPayments.forEach(e1 => { e1.challanType = this.utilsService.challanTypes?.find(e => e.val === e1.challanType)?.name ?? '' })
        this.totalRecord = res.metadata.recordcount;
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

  onBtnExport() {
    this.downloadService.exportToCSV(this.getReportData(), 'contractor_challan_data.csv')
  }

  onBtnExportExcel() {
    this.downloadService.exportToExcel(this.getReportData(), 'contractor_challan_data.xlsx')
  }

  getReportData() {
    return this.contractorPayments.map(e => ({

      'Payment Date': e.paymentDate,
      'Contractor Name': e.contractor.contractorName,
      'Contractor Mobile': e.contractor.mobile,
      'Payment Amount': e.paymentAmount,
    }));
  }

  // peaceCount(params: any) {
  //   let totalQuantity = 0;
  //   params.challanItems.forEach((e: { quantity: number; }) => totalQuantity += e.quantity);
  //   return `${totalQuantity}`;
  // }

  formatDate(event: any) {
    const [day, month, year] = formatDate(event.value, 'dd-MM-yyyy', 'en-US').split('-').map(Number);
    const dateObj = new Date(year, month - 1, day)
    this.fromDate = dateObj;
  }
  //=================Items details =============



}

class challanFilter {
  contractorid: string;
  fromDate: string;
  toDate: string;
  constructor() {
    this.contractorid = '';
    this.fromDate = '';
    this.toDate = '';
  }
}

