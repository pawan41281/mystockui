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
import { orderFilter } from '../../model/orderFilter';
import { DataService } from 'src/app/services/data-service';
import { UtilService } from 'src/app/services/util-service';
import { DownloadSerivceService } from 'src/app/services/download-serivce-service';
import { order } from 'src/app/model/order';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { userData } from 'src/app/model/userData';
import { requestResponse } from 'src/app/model/requestResponse';
import { quality } from 'src/app/model/quality';
import { color } from 'src/app/model/color';
import { design } from 'src/app/model/design';

@Component({
  selector: 'app-order-register-component',
  imports: [AgGridAngular, FormsModule, CommonModule, MatDatepickerModule,
    MatNativeDateModule, MatInputModule, NgbTypeaheadModule, CardComponent],
  templateUrl: './order-register-component.html',
  styleUrl: './order-register-component.scss'
})
export class OrderRegisterComponent implements OnInit {

  id: string = '';
  url: string = 'clientorders';
  totalRecord: number = 0;
  http = inject(HttpClient)
  dataService = inject(DataService)
  router = inject(ActivatedRoute)
  route = inject(Router)
  utilsService: UtilService = inject(UtilService);
  clientOrders: order[] = [];
  private readonly downloadService = inject(DownloadSerivceService);
  private gridApi!: GridApi;
  clients: client[] = [];
  dropdownData: client[] = [];
  itemDetails: challanItems[] | undefined = [];
  designs: design[] = [];
  colors: color[] = [];
  qualityList: quality[] = [];
  fromDate: Date = new Date();
  toDate: Date = new Date();
  filterObj: orderFilter = new orderFilter();
  isAdmin: boolean = false;
  userInfo: userData;
  maxDate: Date;

  constructor() {
    this.getClients();
  }

  ngOnInit() {

    this.router.queryParams.subscribe(params => {
      if (params['challanType']) {
        this.fromDate = new Date(params['fromDate']);
        this.toDate = new Date(params['toDate']);
      }
      this.maxDate = this.utilsService.getMaxDate(this.fromDate)
    });

    this.searchClientOrder()
    this.userInfo = this.utilsService.getCurrentUserInfo()
    this.isAdmin = this.userInfo.roles.filter(e => e.adminrole).length > 0
    this.getDesignts();
    this.getColors();
    this.getQualityList();

  }

  calculateMaxDate() {
    this.maxDate = this.utilsService.getMaxDate(this.fromDate)
  }

  // fetch quality list
  getQualityList = () => {
    this.dataService.get('quality')
      .subscribe((res: requestResponse) => {
        this.qualityList = res.data;
      })
  }

  //fethc design list

  getDesignts = () => {
    this.dataService.get('designs')
      .subscribe((res: requestResponse) => {
        this.designs = res.data;
      })
  }

  // fetch color list
  getColors = () => {
    this.dataService.get('colors')
      .subscribe((res: requestResponse) => {
        this.colors = res.data;
      })
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
        this.clientOrders = res.data;
        this.totalRecord = res.metadata.recordcount
      })
  }


  // onInputBlur(): void {
  //   this.clientOrder.quantity = Number(this.clientOrder.quantity)
  //   this.isItemExist = this.itemExist();
  //   const { design, color, quantity } = this.clientOrder;
  //   this.disableAdd = !(design && color && quantity > 0 && !this.isItemExist);
  // }
  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<order>[] = [
    {
      headerName: "Order Date",
      field: "orderDate",
    },
    {
      headerName: "Order Number",
      field: "orderNumber",
    },
    {
      headerName: "Client Name",
      field: "client.clientName",
    },
    {
      headerName: "Pices Count",
      cellRenderer: this.myCellRenderer
    },
    {
      headerName: '',
      cellClass: 'align-center',
      sortable: false,
      filter: false,
      cellRenderer: this.myCellRendererAction.bind(this),
      onCellClicked: (event) => {
        this.itemDetails = event.data?.orderItems;
      }
    }
  ];

  challanType(params: any) {
    return `<span> ${params.node.data.challanType == 'R' ? 'Recieve' : 'Issue'} </span>`
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


  myCellRenderer(params: any) {
    let totalQuantity = 0;
    params.node.data.orderItems.forEach((e: { quantity: number; }) => totalQuantity += e.quantity);
    return `<span>${totalQuantity}</span>`;
  }


  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    filter: true,
  };

  deleteOrders() {
    this.dataService.delete(`${this.url}/${this.id}`)
      .subscribe((res: any) => {
        this.clientOrders = res.data;
        this.totalRecord = res.metadata.recordcount;
        this.searchClientOrder()
      })
  }

  searchClientOrder = () => {
    this.filterObj.fromorderdate = this.fromDate && !this.utilsService.isValidDateFormat(this.fromDate.toString()) ? this.utilsService.formatDate_dd_MM_YYYY(this.fromDate) : '';
    this.filterObj.toorderdate = this.toDate && !this.utilsService.isValidDateFormat(this.toDate.toString()) ? this.utilsService.formatDate_dd_MM_YYYY(this.toDate) : '';
    this.filterObj.clientid = this.dropdownData.find(e => e.clientName === this.filterObj.clientName)?.id
    let finalUrl = '';
    finalUrl = this.url + this.utilsService.buildUrl(this.filterObj);

    this.dataService.get(finalUrl)
      .subscribe((res: any) => {
        this.clientOrders = res.data;
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
    this.downloadService.exportToCSV(this.getReportData(), 'Client_Order_data.csv')
  }

  onBtnExportExcel() {
    this.downloadService.exportToExcel(this.getReportData(), 'Client_Order_data.xlsx')
  }

  getReportData() {
    return this.clientOrders.map(e => ({
      'Order Number': e.orderNumber,
      'Order Date': e.orderDate,
      'Client Name': e.client.clientName,
      'Mobile No': e.client.mobile,
      'Total Pieces': this.peaceCount(e),
    }));
  }

  peaceCount(params: any) {
    let totalQuantity = 0;
    params.orderItems.forEach((e: { quantity: number; }) => totalQuantity += e.quantity);
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
