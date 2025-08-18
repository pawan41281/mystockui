import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
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
import { debounceTime, distinctUntilChanged, Observable, of, switchMap } from 'rxjs';
import { challanItems } from '../../model/challanItems';
import { contractorChallan } from '../../model/contractorChallan';
import { contractor } from '../../model/contractor';
import { formatDate } from '@angular/common';
import { DownloadSerivceService } from 'src/app/services/download-serivce-service';
import { UtilService } from 'src/app/services/util-service';
import { DataService } from 'src/app/services/data-service';

@Component({
  selector: 'app-contractor-challan-register-component',
  imports: [AgGridAngular, FormsModule, CommonModule, MatDatepickerModule,
    MatNativeDateModule, MatInputModule, NgbTypeaheadModule],
  templateUrl: './contractor-challan-register-component.html',
  styleUrl: './contractor-challan-register-component.scss'
})
export class ContractorChallanRegisterComponent {

  id: string = '';
  url: string = 'contractorchallans';
  totalRecord: number = 0;
  http = inject(HttpClient)
  dataService = inject(DataService)
  utilsService: UtilService = inject(UtilService);
  contractorChallans: contractorChallan[] = [];
  contractorChallanObj: contractorChallan = new contractorChallan();
  private readonly downloadService = inject(DownloadSerivceService);
  private gridApi!: GridApi;
  contractors: contractor[] = [];
  dropdownData: contractor[] = [];
  itemDetails: challanItems[] | undefined = [];
  fromDate: Date = new Date();
  toDate: Date = new Date();
  filterObj: challanFilter = new challanFilter();

  constructor(public router: ActivatedRoute, public route: Router) {
    this.getClients();
  }

  ngOnInit() {
    this.searchContractorChallan()
  }

  getClients = () => {
    this.dataService.get('contractors')
      .subscribe((res: any) => {
        this.contractors = res.data;
        this.dropdownData = this.contractors;

        console.log('client data ', this.contractors)
      })
  }

  getClientData = () => {
    this.dataService.get(this.url)
      .subscribe((res: any) => {
        this.contractorChallans = res.data;
        this.totalRecord = res.metadata.recordcount
      })

  }

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<contractorChallan>[] = [
    {
      headerName: "Challan Number",
      field: "challanNumber",
    },
    {
      headerName: "Challan Date",
      cellRenderer: this.renderDate
    },
    {
      headerName: "Contractor Name",
      field: "contractor.contractorName",
    },
    {
      headerName: "Contractor Mobile",
      field: "contractor.mobile",
    },
    {
      headerName: "Challan Type",
      field: 'challanType'
    },
    {
      headerName: "Pices Count",
      cellRenderer: this.myCellRenderer
    },
    {
      headerName: '',
      sortable: false,
      filter: false,
      cellRenderer: this.myCellRendererAction.bind(this),
      onCellClicked: (event) => {
        this.itemDetails = event.data?.challanItems;
      }
    }
  ];

  renderDate(params: any) {
    return formatDate(params.node.data.challanDate, 'dd-MM-yyyy', 'en-US');
  }


  myCellRenderer(params: any) {
    let totalQuantity = 0;
    params.node.data.challanItems.forEach((e: { quantity: number; }) => totalQuantity += e.quantity);
    //let count = this.peaceCount(params.node.data.challanItems);
    // console.log('count data ', count)
    return `<span>${totalQuantity}</span>`;
  }

  myCellRendererAction(params: any) {
    this.id = params.node.data.id;
    return `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"> <i class="bi bi-search"></i> </button>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#deleteModal"> <i class="bi bi-trash"></i> </button>`;
  }

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    filter: true,

  };

  cancelChallan() {
    // this.dataService.delete(this.url + this.id)
    //   .subscribe((res: any) => {
    //     this.contractorChallans = res.data;
    //     this.totalRecord = res.metadata.recordcount;
    //     this.searchContractorChallan()
    //   })

  }

  // deleteClient() {
  //   this.dataService.update(this.id, false, this.url)
  //     .subscribe((res: any) => {
  //       this.contractorChallans[0] = res;

  //     })
  //   this.getClientData();
  //   this.route.navigate(["/list-client"])
  // }

  searchContractorChallan = () => {
    console.log('search obj ', this.filterObj)

    this.filterObj.fromchallandate = this.fromDate ? this.utilsService.formatDate_dd_MM_YYYY(this.fromDate) : '';
    this.filterObj.tochallandate = this.toDate ? this.utilsService.formatDate_dd_MM_YYYY(this.toDate) : '';
    let url = '';
    url = this.url + this.utilsService.buildUrl(this.filterObj);
    console.log('url ', url)
    this.dataService.get(url)
      .subscribe((res: any) => {
        this.contractorChallans = res.data;
        this.contractorChallans.forEach(e1 => { e1.challanType = this.utilsService.challanTypes?.find(e => e.val === e1.challanType)?.name ?? '' })
        this.totalRecord = res.metadata.recordcount;
      })
    console.log(' this.contractorChallans ', this.contractorChallans)
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term =>
        term.length < 2 ? of([]) : this.http.get<contractor[]>(`contractors/?contractorName=${term}`)
      )
    );

  formatter = (result: any) => result.clientName;

  filterData(event: any) {
    this.dropdownData = this.contractors.filter(e => e.contractorName.includes(event.target.value.toUpperCase()))
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onBtnExport() {
    this.downloadService.exportToCSV(this.getReportData(), 'contractor_challan_data.csv')
  }

  onBtnExportExcel() {
    this.downloadService.exportToExcel(this.getReportData(), 'contractor_challan_data.xlsx')
  }

  getReportData() {
    return this.contractorChallans.map(e => ({
      'Challan Number': e.challanNumber,
      'Challan Date': e.challanDate,
      'Contractor Name': e.contractor.contractorName,
      'Contractor Mobile': e.contractor.mobile,
      'Challan Type': e.challanType,
      'Total Pieces': this.peaceCount(e),
    }));
  }

  peaceCount(params: any) {
    let totalQuantity = 0;
    params.challanItems.forEach((e: { quantity: number; }) => totalQuantity += e.quantity);
    return `${totalQuantity}`;
  }

  formatDate(event: any) {
    console.log(' date formate ', event.value, 'converted date ', formatDate(event.value, 'dd-MM-yyyy', 'en-US'))

    const [day, month, year] = formatDate(event.value, 'dd-MM-yyyy', 'en-US').split('-').map(Number);
    const dateObj = new Date(year, month - 1, day)
    console.log('dateObj ', dateObj)
    this.fromDate = dateObj;
  }
  //=================Items details =============

  itemDetailsColDefs: ColDef<challanItems>[] = [
    {
      headerName: "Design Name",
      field: "design.designName",
    },
    {
      headerName: "Color Name",
      field: "color.colorName",
    },
    {
      headerName: "Quantity",
      field: "quantity",
    }
  ];

}

class challanFilter {
  challannumber: string;
  contractorid: String;
  fromchallandate: String;
  tochallandate: String;
  challantype: string;

  constructor() {
    this.challannumber = "";
    this.contractorid = '';
    this.fromchallandate = '';
    this.tochallandate = '';
    this.challantype = '';
  }
}

