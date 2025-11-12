import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { client } from '../../model/client';
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
import { challanItems } from '../../model/challanItems';
import { challanFilter } from '../../model/challanFilter';
import { DataService } from 'src/app/services/data-service';
import { UtilService } from 'src/app/services/util-service';
import { clientChallan } from 'src/app/model/clientChallan';
import { DownloadSerivceService } from 'src/app/services/download-serivce-service';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { userData } from 'src/app/model/userData';

@Component({
  selector: 'app-party-challan-register-component',
  imports: [AgGridAngular, FormsModule, CommonModule, MatDatepickerModule,
    MatNativeDateModule, MatInputModule, NgbTypeaheadModule, CardComponent],
  templateUrl: './party-challan-register-component.html',
  styleUrl: './party-challan-register-component.scss'
})
export class PartyChallanRegisterComponent implements OnInit {

  id: string = '';
  url: string = 'clientchallans';
  totalRecord: number = 0;
  http = inject(HttpClient)
  dataService = inject(DataService)
  router = inject(ActivatedRoute)
  route = inject(Router)
  utilsService: UtilService = inject(UtilService);
  clientChallans: clientChallan[] = [];
  clientChallanObj: clientChallan = new clientChallan();
  private readonly downloadService = inject(DownloadSerivceService);
  private gridApi!: GridApi;
  clients: client[] = [];
  dropdownData: client[] = [];
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

    this.router.queryParams.subscribe(params => {
      if (params['challanType']) {
        this.filterObj.challantype = params['challanType'];
        this.fromDate = new Date(params['fromDate']);
        this.toDate = new Date(params['toDate']);
      }

    });

    this.searchClientChallan()
    this.userInfo = this.utilsService.getCurrentUserInfo()
    this.isAdmin = this.userInfo.roles.filter(e => e.adminrole).length > 0
  }

  getClients = () => {
    this.dataService.get('clients')
      .subscribe((res: any) => {
        this.clients = res.data;
        this.dropdownData = this.clients;
      })
  }

  getClientData = () => {
    this.dataService.get(this.url)
      .subscribe((res: any) => {
        this.clientChallans = res.data;
        this.totalRecord = res.metadata.recordcount
      })
  }

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<clientChallan>[] = [
    {
      headerName: "Challan Number",
      field: "challanNumber",
    },
    {
      headerName: "Challan Date",
      field: "challanDate",
    },
    {
      headerName: "Party Name",
      field: "client.clientName",
    },
    {
      headerName: "Party Mobile",
      field: "client.mobile",
    },
    {
      headerName: "Challan Type",
      cellRenderer: this.challanType
    },
    {
      headerName: "Pices Count",
      cellRenderer: this.myCellRenderer
    },
    {
      headerName: "Order Number",
      field: "order.orderNumber",
    },
    {
      headerName: '',
      cellClass: 'align-center',
      sortable: false,
      filter: false,
      cellRenderer: this.myCellRendererAction.bind(this),
      onCellClicked: (event) => {
        this.itemDetails = event.data?.challanItems;
      }
    }
  ];

  challanType(params: any) {
    return `<span> ${params.node.data.challanType == 'R' ? 'Recieve' : 'Issue'} </span>`
  }


  myCellRenderer(params: any) {
    let totalQuantity = 0;
    params.node.data.challanItems.forEach((e: { quantity: number; }) => totalQuantity += e.quantity);
    return `<span>${totalQuantity}</span>`;
  }

  myCellRendererAction(params: any) {
    this.id = params.node.data.id;
    // return this.isAdmin ? `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"> <i class="bi bi-search"></i> </button>
    //  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#deleteModal"> <i class="bi bi-trash"></i> </button>`
    //   : `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"> <i class="bi bi-search"></i> </button>`;

    return this.isAdmin ?
      // `
      //  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"> 
      //   <i class="bi bi-search"></i> 
      //  </button>
      //  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#deleteModal">
      //   <i class="bi bi-trash"></i> 
      //  </button>
      // `
      `
       <img src="assets/images/find.png" style="width: 20px; height: 20px;" (click)="searchContractorChallan()" data-bs-toggle="modal" data-bs-target="#exampleModal">
       &nbsp;
       <img src="assets/images/delete.png" style="width: 20px; height: 20px;" (click)="cancelChallan()" data-bs-toggle="modal" data-bs-target="#deleteModal">
      `
      :
      // `
      //  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"> 
      //   <i class="bi bi-search"></i> 
      //  </button>
      // `
      `
       <img src="assets/images/find.png" style="width: 20px; height: 20px;" (click)="searchContractorChallan()" data-bs-toggle="modal" data-bs-target="#exampleModal">
      `
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
      .subscribe((res: any) => {
        this.clientChallans = res.data;
        this.totalRecord = res.metadata.recordcount;
        this.searchClientChallan()
      })
  }

  searchClientChallan = () => {
    this.filterObj.fromchallandate = this.fromDate && !this.utilsService.isValidDateFormat(this.fromDate.toString()) ? this.utilsService.formatDate_dd_MM_YYYY(this.fromDate) : '';
    this.filterObj.tochallandate = this.toDate && !this.utilsService.isValidDateFormat(this.toDate.toString()) ? this.utilsService.formatDate_dd_MM_YYYY(this.toDate) : '';
    this.filterObj.clientid = this.dropdownData.find(e => e.clientName === this.filterObj.clientName)?.id
    let finalUrl = '';
    finalUrl = this.url + this.utilsService.buildUrl(this.filterObj);

    this.dataService.get(finalUrl)
      .subscribe((res: any) => {
        this.clientChallans = res.data;
        this.totalRecord = res.metadata.recordcount;
      })

  }


  selectedParty(party: any) {

    const obj = this.dropdownData.find(e => e.clientName === party);
    this.filterObj.clientName = obj?.clientName != undefined ? obj?.clientName + '' : '';
  }
  filterData(event: any) {
    this.dropdownData = this.clients.filter(e => e.clientName.includes(event.target.value.toUpperCase()))
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onBtnExport() {
    this.downloadService.exportToCSV(this.getReportData(), 'Party_challan_data.csv')
  }

  onBtnExportExcel() {
    this.downloadService.exportToExcel(this.getReportData(), 'Party_challan_data.xlsx')
  }

  getReportData() {
    return this.clientChallans.map(e => ({
      'Challan Number': e.challanNumber,
      'Challan Date': e.challanDate,
      'Party Name': e.client.clientName,
      'Party Mobile': e.client.mobile,
      'Challan Type': e.challanType,
      'Total Pieces': this.peaceCount(e),
    }));
  }

  peaceCount(params: any) {
    let totalQuantity = 0;
    params.challanItems.forEach((e: { quantity: number; }) => totalQuantity += e.quantity);
    return `${totalQuantity}`;
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
    }
  ];
}
