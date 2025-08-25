import { Component, inject, OnInit } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import type { ColDef, CsvExportParams, GridReadyEvent } from "ag-grid-community";
import { GridApi } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { design } from '../../model/design';
import { color } from '../../model/color';
import { stockRegisger } from '../../model/stockRegister';
import { client } from '../../model/client';
import { contractor } from '../../model/contractor';
import { DataService } from 'src/app/services/data-service';
import { UtilService } from 'src/app/services/util-service';
import { DownloadSerivceService } from 'src/app/services/download-serivce-service';

@Component({
  selector: 'app-contractor-stock-register-component',
  imports: [AgGridAngular, FormsModule, CommonModule, MatDatepickerModule,
    MatNativeDateModule, MatInputModule, NgbTypeaheadModule],
  templateUrl: './contractor-stock-register-component.html',
  styleUrl: './contractor-stock-register-component.scss'
})
export class ContractorStockRegisterComponent {



  filterObj: StockFilter = new StockFilter();
  dataService = inject(DataService)
  router = inject(ActivatedRoute)
  route = inject(Router)
  utilsService: UtilService = inject(UtilService);
  private readonly downloadService = inject(DownloadSerivceService);
  designs: design[] = [];
  colors: color[] = [];
  constructors: contractor[] = [];
  private gridApi!: GridApi;
  stockRegister: stockRegisger[] = [];
  private url: string = 'contractorstockreports'
  totalRecord: number = 0;
  constructor() {
    this.getDesignts();
    this.getColors();
    this.searchStock()
    this.getContractor()
  }


  //fethc design list

  getDesignts = () => {
    this.dataService.get('designs')
      .subscribe((res: any) => {
        this.designs = res.data;
      })
  }

  // fetch color list
  getColors = () => {
    this.dataService.get('colors')
      .subscribe((res: any) => {
        this.colors = res.data;
      })
  }

  getContractor = () => {
    this.dataService.get('contractors')
      .subscribe((res: any) => {
        this.constructors = res.data;
      })
  }
  searchStock() {

    this.stockRegister = []
    let url = ''
    url = this.url + this.utilsService.buildUrl(this.filterObj)
    this.dataService.get(url)
      .subscribe((res: any) => {
        this.stockRegister = res.data;
        this.totalRecord = res.metadata.recordcount
      })

  }

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    filter: true,

  };
  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<stockRegisger>[] = [
    {
      headerName: "Contractor",
      field: "contractorName",
    },
    {
      headerName: "Design",
      field: "designName",
    },
    {
      headerName: "Color",
      field: "colorName",
    },
    {
      headerName: "Opening Balance",
      field: "openingBalance",
    },
    {
      headerName: "Current Balance",
      field: "closingBalance",
    }
  ];
  onBtnExport() {
    this.downloadService.exportToCSV(this.getReportData(), 'contractor_stock_report.csv')
  }

  onBtnExportExcel() {
    this.downloadService.exportToExcel(this.getReportData(), 'contractor_stock_report.xlsx')
  }

  getReportData() {
    return this.stockRegister.map(e => ({
      'Contractor Name': e.contractorName,
      'Design Name': e.designName,
      'Color Name': e.colorName,
      'Stock Balance': e.closingBalance,
    }));
  }

}
class StockFilter {
  colorName: string;
  designName: string;
  contractorName: string;

  constructor() {
    this.colorName = "";
    this.designName = '';
    this.contractorName = '';
  }
}