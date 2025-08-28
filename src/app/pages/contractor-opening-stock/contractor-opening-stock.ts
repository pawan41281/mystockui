import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { type ColDef, type GridApi, type GridReadyEvent } from "ag-grid-community";
import { design } from '../../model/design';
import { color } from '../../model/color';
import { challanFilter } from 'src/app/model/challanFilter';
import { UtilService } from 'src/app/services/util-service';
import { contractorChallan } from 'src/app/model/contractorChallan';
import { DataService } from 'src/app/services/data-service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { intilaStock } from 'src/app/model/initialStock';
import { stock } from 'src/app/model/stock';
import { contractor } from 'src/app/model/contractor';
import { DownloadSerivceService } from 'src/app/services/download-serivce-service';


@Component({
  selector: 'app-contractor-opening-stock',
  imports: [FormsModule, CommonModule, AgGridAngular, MatDatepickerModule,
    MatNativeDateModule, MatInputModule, CardComponent],
  templateUrl: './contractor-opening-stock.html',
  styleUrl: './contractor-opening-stock.scss'
})
export class ContractorOpeningStock implements OnInit {


  id: string = '';
  private allStockUrl: string = 'contractorstocks'
  url: string = 'contractorstocks/bulk';
  http = inject(HttpClient)
  dataService = inject(DataService)
  contractorChallanObj: contractorChallan = new contractorChallan();
  private readonly downloadService = inject(DownloadSerivceService);
  totalRecord: number = 0;
  utilsService: UtilService = inject(UtilService);
  private gridApi!: GridApi;
  rowCnt: number;
  rowId: string = '';
  items: any[] = [];
  stockData: intilaStock[] = []
  designs: design[] = [];
  colors: color[] = [];
  contractors: contractor[] = [];
  disableAdd: boolean = true;
  isItemExist: boolean = false;
  showSuccessMessage: boolean = false;
  successMessage: string = '';

  filterObj: challanFilter = new challanFilter();
  contractorName: string;


  constructor() {
    this.rowCnt = 1;
    this.getDesignts();
    this.getColors();
    this.getAllInitialStock()
    this.getContractor()
  }

  getAllInitialStock = () => {
    this.dataService.get(`${this.allStockUrl}`)
      .subscribe((res: any) => {
        this.stockData = res.data;
        this.totalRecord = res.data.length;
      })
  }

  getContractor = () => {
    this.dataService.get('contractors')
      .subscribe((res: any) => {
        this.contractors = res.data;
      })
  }
  ngOnInit() {
    if (this.id) {
      this.dataService.get(`${this.id}/${this.url}`)
        .subscribe((res: any) => {
          this.contractorChallanObj = res;
        })
    }
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
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


  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<stock>[] = [
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
      field: 'quantity',
      headerName: 'quantityStr',
      editable: true, // 👈 make this column editable
      cellEditor: 'agTextCellEditor' // default is already agTextCellEditor
    },
    {
      headerName: 'Action',
      sortable: false,
      filter: false,
      cellRenderer: this.buttonRenderer,
      cellRendererParams: {
        onClick: this.onButtonClick.bind(this),
        label: 'Delete'
      },
      width: 120
    }
  ];


  colDefs_opening_stock: ColDef<intilaStock>[] = [
    {
      headerName: "Contractor",
      field: "contractor.contractorName",
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
      headerName: 'Opening Balance',
      field: 'openingBalance'
    },
    {
      headerName: 'Current Balance',
      field: 'balance'
    },
  ];


  buttonRenderer(params: any): HTMLElement {
    const button = document.createElement('button');
    button.innerHTML = params.label || 'Click';
    button.classList.add('btn', 'btn-sm', 'btn-primary'); // optional Bootstrap classes
    button.addEventListener('click', () => {
      if (params.onClick) {
        params.onClick(params);
      }
    });
    return button;
  }

  onButtonClick(params: any) {
    const rowData = params.data;
    // Example: remove the row
    this.gridApi.applyTransaction({ remove: [rowData] });

    const index = this.items.findIndex(obj => obj.id === rowData.id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    filter: true,
    editable: false

  };

  onCellValueChanged(): void {

  }

  onSave = () => {

    const obj = { 'contractorStockVos': this.buildItemsData() }
    this.dataService.post(this.url, obj)
      .subscribe((res: any) => {
        if (res.status === 'success') {

          this.successMessage = 'Data saved successfully!';
          this.showSuccessMessage = true;
          this.contractorChallanObj = new contractorChallan();
          this.contractorName = ''
          this.getAllInitialStock();
          setTimeout(() => {
            this.showSuccessMessage = false;
            this.successMessage = '';
          }, 3000);
          this.items = [];
          //this.cancel();
        }
      })
  }



  buildItemsData = () => {
    const arr: any = []

    this.items.forEach(e => {
      arr.push({
        contractor: { id: e.contractorId },
        design: { id: e.designId },
        color: { id: e.colorId },
        openingBalance: e.quantity,
      });
    });
    return arr;
  }

  getDesignName = (id: number) => {
    return this.designs.filter(e => e.id == id)[0].designName;
  }
  getColorData = (id: number) => {
    return this.colors.filter(e => e.id == id)[0].colorName;
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  getRowId(params: any): string {
    return params.data.id// `${params.data.designId}-${params.data.colorId}`;
  }

  itemExist() {

    return this.items.some(e => e.designId == this.contractorChallanObj.design && e.colorId == this.contractorChallanObj.color && e.contractorName == this.contractorName)
  }

  addItems = () => {

    if (this.itemExist()) {
      this.isItemExist = true;
    } else {

      this.items.push({
        'id': this.rowCnt++,
        'contractorId': this.contractors.find(e => e.contractorName == this.contractorName).id,
        'contractorName': this.contractorName,
        'designId': this.contractorChallanObj.design,
        'designName': this.getDesignName(this.contractorChallanObj.design),
        'colorId': this.contractorChallanObj.color,
        'colorName': this.getColorData(this.contractorChallanObj.color),
        'quantity': this.contractorChallanObj.quantityStr
      })
      this.gridApi.applyTransaction({ remove: this.items });
      this.gridApi.applyTransaction({ add: this.items });
      this.clearItems();
      this.isItemExist = false;
    }
  }

  clearItems() {
    this.contractorChallanObj = new contractorChallan();
    this.disableAdd = true;
    this.contractorName = '';
  }

  onInputBlur = () => {
    //this.contractorChallanObj.quantity = Number(this.contractorChallanObj.quantityStr)
    this.isItemExist = this.itemExist();
    const { design, color, quantityStr } = this.contractorChallanObj;
    this.disableAdd = !(design && color && quantityStr && !this.isItemExist)

  }

  onBtnExport() {
    this.downloadService.exportToCSV(this.getReportData(), 'contractor_opening_stock_report.csv')
  }

  onBtnExportExcel() {
    this.downloadService.exportToExcel(this.getReportData(), 'contractor_opening_stock_report.xlsx')
  }

  getReportData() {
    return this.stockData.map(e => ({

      'Design Name': e.design.designName,
      'Color Name': e.color.colorName,
      'Opening Balance': e.openingBalance,
      'Current Balance': e.balance
    }));
  }
}
