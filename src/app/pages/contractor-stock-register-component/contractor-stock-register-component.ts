import { Component, inject, OnInit } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import type { ColDef } from "ag-grid-community";
import { GridApi } from 'ag-grid-community';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { design } from '../../model/design';
import { color } from '../../model/color';
import { stockRegisger } from '../../model/stockRegister';
import { contractor } from '../../model/contractor';
import { DataService } from 'src/app/services/data-service';
import { UtilService } from 'src/app/services/util-service';
import { DownloadSerivceService } from 'src/app/services/download-serivce-service';
import { requestResponse } from 'src/app/model/requestResponse';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { quality } from 'src/app/model/quality';

@Component({
  selector: 'app-contractor-stock-register-component',
  imports: [AgGridAngular, FormsModule, CommonModule, MatDatepickerModule,
    MatNativeDateModule, MatInputModule, NgbTypeaheadModule, CardComponent],
  templateUrl: './contractor-stock-register-component.html',
  styleUrl: './contractor-stock-register-component.scss'
})
export class ContractorStockRegisterComponent implements OnInit {

  filterObj: StockFilter = new StockFilter();
  dataService = inject(DataService)
  utilsService: UtilService = inject(UtilService);
  private readonly downloadService = inject(DownloadSerivceService);
  designs: design[] = [];
  colors: color[] = [];
  contractors: contractor[] = [];
  private gridApi!: GridApi;
  stockRegister: stockRegisger[] = [];
  private url: string = 'contractorstockreports'
  totalRecord: number = 0;
  qualityList: quality[] = [];

  ngOnInit(): void {
    this.getDesignts();
    this.getColors();
    this.searchStock()
    this.getContractor()
    this.getQualityList();
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

  getContractor = () => {
    this.dataService.get('contractors')
      .subscribe((res: requestResponse) => {
        this.contractors = res.data;
      })
  }
  searchStock() {

    this.stockRegister = []
    let url = ''
    url = this.url + this.utilsService.buildUrl(this.filterObj)
    this.dataService.get(url)
      .subscribe((res: requestResponse) => {
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
    { headerName: "Contractor", field: "contractorName" },
    { headerName: "Quality", field: "qualityName" },
    { headerName: "Design", field: "designName" },
    { headerName: "Color", field: "colorName" },
    { headerName: "Current Balance", cellRenderer: this.myItemCellRenderer }
  ];

  myItemCellRenderer(params: any) {
    const currentBalance = params.node.data.closingBalance;
    return params.node.data.closingBalance >= 0 ? `<span>${currentBalance}</span>` : `<span class="color-red">${currentBalance}</span>`;
  }

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
  colorId: number;
  designId: number;
  contractorId: number;
  qualityId: number;

  constructor() {
    this.colorId = 0;
    this.designId = 0;
    this.contractorId = 0;
    this.qualityId = 0;
  }
}