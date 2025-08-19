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
import { client } from 'src/app/model/client';
import { contractor } from 'src/app/model/contractor';


@Component({
  selector: 'app-contractor-component',
  imports: [CardComponent, AgGridAngular, FormsModule, CommonModule],
  templateUrl: './contractor-component.html',
  styleUrl: './contractor-component.scss'
})
export class ContractorComponent {

  id: string = '';
  action: string = '';
  url: string = 'contractors';
  contractorObj: contractor = new contractor();
  dataService = inject(DataService);
  utilsService: UtilService = inject(UtilService);
  downloadService = inject(DownloadSerivceService)
  isValidGst: boolean = false;
  showStatus: boolean = false;
  private gridApi!: GridApi;
  contractor: contractor[] = [];
  totalRecord: number = 0;
  showSuccessMessage: boolean = false;
  successMessage: string = '';

  constructor(public router: ActivatedRoute, public route: Router) {
  }

  ngOnInit() {
    this.searchContractor()
  }


  // updateForm = (key: string, event: any) => {
  //   this.clientFromData.update((data: client) =>
  //     ({ ...data, [key]: event.target.value })
  //   )
  // }

  validateGst() {
    this.isValidGst = this.utilsService.validateGST(this.contractorObj.gstNo);
  }
  cancel = () => {
    this.route.navigate(["/list-client"])
  }
  colDefs: ColDef<contractor>[] = [
    {
      headerName: "Status",
      cellClass: 'margin-top-8',
      sortable: false,
      filter: false,
      cellRenderer: this.utilsService.getStatus
    },
    {
      headerName: "Party",
      field: "contractorName",
    },
    {
      headerName: "Mobile",
      field: "mobile",
    },
    {
      headerName: "Email",
      field: "email",
    }, {
      headerName: '',
      field: 'id',
      sortable: false,
      filter: false,
      cellRenderer: CustomeCellComponent,
      onCellClicked: (event) => {
        if (this.utilsService.commondata.action == 'edit') {
          this.contractorObj = this.utilsService.commondata.data;
        }
      },
      cellRendererParams: {
        page: { name: "contractor" }
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
    this.downloadService.exportToCSV(this.getReportData(), 'contractor_data.csv')
  }

  onBtnExportExcel() {
    this.downloadService.exportToExcel(this.getReportData(), 'contractor_data.xlsx')
  }

  getReportData() {
    return this.contractor.map(e => ({
      'Client Name': e.contractorName,
      'Email': e.email,
      'Mobile': e.mobile,
      'Address': e.address,
      'City': e.city,
      'GST Number': e.gstNo,
      'Status': e.active ? 'Active' : 'Inactive'
    }));
  }

  save(): void {
    this.dataService.post(this.url, this.contractorObj).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.successMessage = 'Data saved successfully!';
          this.showSuccessMessage = true;
          this.contractorObj = new contractor();
          this.searchContractor();
          setTimeout(() => {
            this.showSuccessMessage = false;
            this.successMessage = '';
          }, 3000);
        } else {
          console.warn('Save failed:', res.message);
        }
      },
      error: (err) => {
        console.error('Save error:', err);
      }
    });
  }

  searchContractor = () => {

    this.dataService.get(this.url)
      .subscribe((res: any) => {
        this.contractor = res.data;
        this.totalRecord = res.metadata.recordcount;
      })
  }

  deleteClient() {
    this.dataService.delete(`${this.url} / ${this.id}`)
      .subscribe((res: any) => {
        this.searchContractor();
      })
  }

}
