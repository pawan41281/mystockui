import { Component, inject, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { UtilService } from 'src/app/services/util-service';
import { design } from 'src/app/model/design';
import { DataService } from 'src/app/services/data-service';
import { CustomeCellComponent } from '../custome-cell-component/custome-cell-component';
import { DownloadSerivceService } from 'src/app/services/download-serivce-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { color } from 'src/app/model/color';
import { CommonService } from 'src/app/services/common-service';
import { ResponseData } from 'src/app/model/Response';
import { error } from 'console';


@Component({
  selector: 'app-color-component',
  imports: [CardComponent, AgGridAngular, FormsModule, CommonModule],
  templateUrl: './color-component.html',
  styleUrl: './color-component.scss'
})
export class ColorComponent implements OnInit {

  totalRecord: number = 0;
  utilsService: UtilService = inject(UtilService);
  dataService = inject(DataService);
  downloadService = inject(DownloadSerivceService)
  commonService = inject(CommonService)
  router = inject(ActivatedRoute)
  route = inject(Router)
  colorList: color[] = [];
  private gridApi!: GridApi;
  url: string = 'colors';
  colorObj: color = new color();
  delObj: design = new design();
  isInactiveDesign: boolean = false;
  colorObj1: Promise<ResponseData>;

  ngOnInit(): void {
    //this.getColorData();
    this.commonService.getColorData().then(e => {
      this.colorList = e.datalist
      this.totalRecord = e.totalRecord
    })

  }

  // getColorData = () => {
  //   this.dataService.get(this.url)
  //     .subscribe((res: any) => {
  //       this.colorList = res.data;
  //       this.totalRecord = res.metadata.recordcount
  //     })

  // }

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
      onCellClicked: () => {
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
          //this.getColorData();
        }
      })
  }

  deactivateColor() {

    this.dataService.patch(this.url, this.utilsService.commondata.data.id)
      .subscribe((res: any) => {
        if (res.status === 'success') {
          this.colorObj = new color();
          // this.getColorData();
        }
      })

  }
}
