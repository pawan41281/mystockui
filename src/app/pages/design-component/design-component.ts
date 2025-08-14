import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-design-component',
  imports: [CardComponent, AgGridAngular, FormsModule, CommonModule],
  templateUrl: './design-component.html',
  styleUrl: './design-component.scss'
})
export class DesignComponent implements OnInit {

  totalRecord: number = 0;
  utilsService: UtilService = inject(UtilService);
  dataService = inject(DataService);
  downloadService = inject(DownloadSerivceService)
  designList: design[] = [];
  private gridApi!: GridApi;
  url: string = 'designs';
  designObj: design = new design();
  delObj: design = new design();
  isInactiveDesign: boolean = false;

  constructor(public router: ActivatedRoute, public route: Router) {
  }

  ngOnInit(): void {
    this.router.queryParams.subscribe((params: Params) => {
      console.log('id :: ', params['id']);
      console.log('id :: ', params['action'])
    });
    this.getDesignData();
  }

  getDesignData = () => {
    this.dataService.get(this.url)
      .subscribe((res: any) => {
        this.designList = res.data;
        this.totalRecord = res.metadata.recordcount
      })

  }

  colDefs: ColDef<design>[] = [
    {
      headerName: "Status",
      cellClass: 'margin-top-8',
      sortable: false,
      filter: false,
      cellRenderer: this.utilsService.getStatus
    },
    {
      headerName: "Desing Name",
      field: "designName",
    },
    {
      headerName: "Description",
      field: "description",
    }
    , {
      headerName: '',
      field: 'id',
      sortable: false,
      filter: false,
      cellRenderer: CustomeCellComponent,
      onCellClicked: (event) => {
        if (this.utilsService.commondata.action == 'edit') {
          this.designObj = this.utilsService.commondata.data;
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
    this.downloadService.exportToCSV(this.getReportData(), 'design_data.csv')
  }

  onBtnExportExcel() {
    this.downloadService.exportToExcel(this.getReportData(), 'design_data.xlsx')
  }

  getReportData() {
    return this.designList.map(e => ({
      'Design Name': e.designName,
      'Description': e.description,
      'Status': e.active ? 'Active' : 'Inactive'
    }));
  }

  onSave = () => {
    this.dataService.post(this.url, this.designObj)
      .subscribe((res: any) => {
        if (res.status === 'success') {
          this.designObj = new design();
          this.getDesignData();
        } else {
          console.log(res.message)
        }
      })
  }

  deleteDesign() {
    console.log('this is delete method', this.designObj)

    this.dataService.update(this.url, this.designObj.id)
      .subscribe((res: any) => {
        if (res.status === 'success') {
          this.designObj = new design();
          this.getDesignData();
        } else {
          console.log(res.message)
        }
      })

  }
}