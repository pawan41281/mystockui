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
import { stockRegisger } from 'src/app/model/stockRegister';
import { DownloadSerivceService } from 'src/app/services/download-serivce-service';
import { DataService } from 'src/app/services/data-service';
import { UtilService } from 'src/app/services/util-service';
import { requestResponse } from 'src/app/model/requestResponse';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { quality } from 'src/app/model/quality';

@Component({
  selector: 'app-stock-register-component',
  imports: [AgGridAngular, FormsModule, CommonModule, MatDatepickerModule,
    MatNativeDateModule, MatInputModule, NgbTypeaheadModule, CardComponent],
  templateUrl: './stock-register-component.html',
  styleUrl: './stock-register-component.scss'
})
export class StockRegisterComponent implements OnInit {


  filterObj: StockFilter = new StockFilter();
  dataService = inject(DataService)
  utilsService: UtilService = inject(UtilService);
  private readonly downloadService = inject(DownloadSerivceService);
  designs: design[] = [];
  colors: color[] = [];
  private gridApi!: GridApi;
  stockRegister: stockRegisger[] = [];
  private url: string = 'designstockreports'
  totalRecord: number = 0;
  qualityList: quality[] = [];


  ngOnInit(): void {
    this.getDesignts();
    this.getColors();
    this.searchStock()
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
    { headerName: "Quality", field: "qualityName" },
    { headerName: "Design", field: "designName" },
    { headerName: "Color", field: "colorName" },
    { headerName: "Opening Balance", field: "openingBalance" },
    { headerName: "Current Balance", field: "closingBalance" }
  ];

  onBtnExport() {
    this.downloadService.exportToCSV(this.getReportData(), 'stock_report.csv')
  }

  onBtnExportExcel() {
    this.downloadService.exportToExcel(this.getReportData(), 'stock_report.xlsx')
  }

  getReportData() {
    return this.stockRegister.map(e => ({
      'Design': e.designName,
      'Quality': e.qualityName,
      'Color': e.colorName,
      'Opening Balance': e.openingBalance,
      'Closing Balance': e.closingBalance
    }));
  }

}
class StockFilter {
  colorName: string;
  designName: string;
  qualityName: string;

  constructor() {
    this.colorName = "";
    this.designName = '';
    this.qualityName = "";
  }
}
