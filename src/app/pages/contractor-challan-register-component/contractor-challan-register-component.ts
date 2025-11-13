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
import { contractorChallan } from '../../model/contractorChallan';
import { contractor } from '../../model/contractor';
import { formatDate } from '@angular/common';
import { DownloadSerivceService } from 'src/app/services/download-serivce-service';
import { UtilService } from 'src/app/services/util-service';
import { DataService } from 'src/app/services/data-service';
import { requestResponse } from 'src/app/model/requestResponse';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { userData } from 'src/app/model/userData';

@Component({
  selector: 'app-contractor-challan-register-component',
  imports: [AgGridAngular, FormsModule, CommonModule, MatDatepickerModule,
    MatNativeDateModule, MatInputModule, NgbTypeaheadModule, CardComponent],
  templateUrl: './contractor-challan-register-component.html',
  styleUrl: './contractor-challan-register-component.scss'
})
export class ContractorChallanRegisterComponent implements OnInit {

  id: string = '';
  url: string = 'contractorchallans';
  totalRecord: number = 0;
  http = inject(HttpClient)
  dataService = inject(DataService)
  utilsService: UtilService = inject(UtilService);
  router: ActivatedRoute = inject(ActivatedRoute);
  route: Router = inject(Router);
  contractorChallans: contractorChallan[] = [];
  contractorChallanObj: contractorChallan = new contractorChallan();
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
  invalidDateRange: boolean = false;
  errorMessage: string = '';

  constructor() {
    this.getClients();
  }

  ngOnInit() {
    this.router.queryParams.subscribe(params => {
      if (params['challanType']) {
        this.filterObj.challantype = params['challanType'];
        this.fromDate = new Date(params['fromDate']);
        this.toDate = new Date(params['toDate']);
      }

    });
    this.searchContractorChallan()
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
        this.contractorChallans = res.data;
        this.totalRecord = res.metadata.recordcount
      })

  }

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<contractorChallan>[] = [
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
      cellRenderer: this.myCellRenderer
    },
    {
      headerName: "Amount",
      cellRenderer: this.calculateAmount
    },
    {
      headerName: '',
      sortable: false,
      filter: false,
      cellRenderer: this.myCellRendererAction.bind(this),
      onCellClicked: (event) => {
        this.itemDetails = event.data?.challanItems;
        //console.log('item details ', this.itemDetails)
      }
    }
  ];

  renderDate(params: any) {
    return formatDate(params.node.data.challanDate, 'dd-MM-yyyy', 'en-US');
  }


  myCellRenderer(params: any) {
    let totalQuantity = 0;
    params.node.data.challanItems.forEach((e: { quantity: number; }) => totalQuantity += e.quantity);
    return `<span>${totalQuantity}</span>`;
  }

  calculateAmount(params: any) {
    let totalAmount = 0;
    params.node.data.challanItems.forEach((e: { rate: number, quantity: number; }) => totalAmount += (e.rate * e.quantity));
    return `<span>${totalAmount}</span>`;
  }


  myCellRendererAction(params: any) {
    this.id = params.node.data.id;
    console.log('this.isAdmin ', this.isAdmin)
    return this.isAdmin ?
      // `
      //  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"> 
      //   <i class="bi bi-search"></i> 
      //  </button>
      //  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#deleteModal">
      //   <i class="bi bi-trash"></i> 
      //  </button>
      // `
      `<div style="text-align: right">
         <img src="assets/images/find.png" style="width: 20px; height: 20px;" (click)="searchContractorChallan()" data-bs-toggle="modal" data-bs-target="#exampleModal">          
         <img src="assets/images/delete.png" style="width: 20px; height: 20px;" (click)="cancelChallan()" data-bs-toggle="modal" data-bs-target="#deleteModal">
       </div>`
      :
      // `
      //  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"> 
      //   <i class="bi bi-search"></i> 
      //  </button>
      // `
      `<div style="text-align: right">
         <img src="assets/images/find.png" style="width: 20px; height: 20px;" (click)="searchContractorChallan()" data-bs-toggle="modal" data-bs-target="#exampleModal">
       </div>`
      ;
  }

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    filter: true,

  };

  cancelChallan() {
    this.dataService.delete(`${this.url}/${this.id}`)
      .subscribe((res: requestResponse) => {
        this.contractorChallans = res.data;
        this.totalRecord = res.metadata.recordcount;
        this.searchContractorChallan()
      })

  }

  searchContractorChallan = () => {

    this.filterObj.fromchallandate = this.fromDate && !this.utilsService.isValidDateFormat(this.fromDate.toString()) ? this.utilsService.formatDate_dd_MM_YYYY(this.fromDate) : '';
    this.filterObj.tochallandate = this.toDate && !this.utilsService.isValidDateFormat(this.fromDate.toString()) ? this.utilsService.formatDate_dd_MM_YYYY(this.toDate) : '';
    let url = '';
    url = this.url + this.utilsService.buildUrl(this.filterObj);
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
    return this.contractorChallans.map(e => ({
      'Challan Number': e.challanNumber,
      'Challan Date': e.challanDate,
      'Contractor Name': e.contractor.contractorName,
      'Challan Type': e.challanType,
      'Total Pieces': this.peaceCount(e),
    }));
  }

  peaceCount(params: any) {
    let totalQuantity = 0;
    params.challanItems.forEach((e: { quantity: number; }) => totalQuantity += e.quantity);
    return `${totalQuantity}`;
  }

  formatDate(event: any) {
    const [day, month, year] = formatDate(event.value, 'dd-MM-yyyy', 'en-US').split('-').map(Number);
    const dateObj = new Date(year, month - 1, day)
    this.fromDate = dateObj;
  }
  //=================Items details =============

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

}

class challanFilter {
  challannumber: string;
  contractorid: string;
  fromchallandate: string;
  tochallandate: string;
  challantype: string;

  constructor() {
    this.challannumber = "";
    this.contractorid = '';
    this.fromchallandate = '';
    this.tochallandate = '';
    this.challantype = '';
  }
}

