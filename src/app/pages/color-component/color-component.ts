import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { ColDef, GridApi, GridReadyEvent, Params } from 'ag-grid-community';
import { UtilService } from 'src/app/services/util-service';
import { design } from 'src/app/model/design';
import { DataService } from 'src/app/services/data-service';
import { CustomeCellComponent } from '../custome-cell-component/custome-cell-component';
import { DownloadSerivceService } from 'src/app/services/download-serivce-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { color } from 'src/app/model/color';

@Component({
  selector: 'app-color-component',
  imports: [CardComponent, AgGridAngular, FormsModule, CommonModule],
  templateUrl: './color-component.html',
  styleUrl: './color-component.scss'
})
export class ColorComponent {

  totalRecord: number = 0;
  utilsService: UtilService = inject(UtilService);
  dataService = inject(DataService);
  downloadService = inject(DownloadSerivceService)
  colorList: color[] = [];
  private gridApi!: GridApi;
  url: string = 'colors';
  colorObj: color = new color();
  delObj: design = new design();
  isInactiveDesign: boolean = false;

  constructor(public router: ActivatedRoute, public route: Router) {
  }

  ngOnInit(): void {
    this.getColorData();
  }

  getColorData = () => {
    this.dataService.get(this.url)
      .subscribe((res: any) => {
        this.colorList = res.data;
        this.totalRecord = res.metadata.recordcount
      })

  }

  colDefs: ColDef<color>[] = [
    {
      headerName: "Status",
      cellClass: 'margin-top-8',
      sortable: false,
      filter: false,
      cellRenderer: this.utilsService.getStatus
    },
    {
      headerName: "Desing Name",
      field: "colorName",
    }
    , {
      headerName: '',
      field: 'id',
      sortable: false,
      filter: false,
      cellRenderer: CustomeCellComponent,
      onCellClicked: (event) => {
        if (this.utilsService.commondata.action == 'edit') {
          this.colorObj = this.utilsService.commondata.data;
        }
      },
      cellRendererParams: {
        page: { name: "design" }
      }
    }
  ];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    filter: true,

  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onBtnExport() {
    this.downloadService.exportToCSV(this.getReportData(), 'color_data.csv')
  }

  onBtnExportExcel() {
    this.downloadService.exportToExcel(this.getReportData(), 'color_data.xlsx')
  }

  getReportData() {
    return this.colorList.map(e => ({
      'Design Name': e.colorName,
      'Status': e.active ? 'Active' : 'Inactive'
    }));
  }

  onSave = () => {
    this.dataService.post(this.url, this.colorObj)
      .subscribe((res: any) => {
        if (res.status === 'success') {
          this.colorObj = new color();
          this.getColorData();
        } else {
          console.log(res.message)
        }
      })
  }

  deactivateColor() {

    this.dataService.patch(this.url, this.utilsService.commondata.data.id)
      .subscribe((res: any) => {
        if (res.status === 'success') {
          this.colorObj = new color();
          this.getColorData();
        } else {
          console.log(res.message)
        }
      })

  }
}
