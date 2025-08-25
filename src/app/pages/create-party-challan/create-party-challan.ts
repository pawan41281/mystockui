import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { clientChallan } from '../../model/clientChallan';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ColumnGroupService, type ColDef, type CsvExportParams, type GridApi, type GridReadyEvent } from "ag-grid-community";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { client } from '../../model/client';
import { design } from '../../model/design';
import { color } from '../../model/color';
import { challanFilter } from '../../model/challanFilter';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { UtilService } from 'src/app/services/util-service';
import { DataService } from 'src/app/services/data-service';

@Component({
  selector: 'app-create-party-challan',
  imports: [CardComponent, FormsModule, CommonModule, AgGridAngular, MatDatepickerModule,
    MatNativeDateModule, MatInputModule],
  templateUrl: './create-party-challan.html',
  styleUrl: './create-party-challan.scss'
})
export class CreatePartyChallan {


  id: string = '';
  action: string = '';
  url: string = 'clientchallans';
  http = inject(HttpClient)
  clientChallanFromData = signal(new clientChallan())
  dataService = inject(DataService)
  clientChallanObj: clientChallan = new clientChallan();
  utilsService: UtilService = inject(UtilService);
  private gridApi!: GridApi;
  rowCnt: number;
  challanDate: Date = new Date();
  items: any[] = [];
  clients: client[] = [];
  designs: design[] = [];
  colors: color[] = [];
  disableAdd: boolean = true;
  showSuccessMessage: boolean = false;
  successMessage: string = '';
  selectedClient: string = ''
  isItemExist: boolean = false;
  isDuplicateChallan: boolean = false;
  filterObj: challanFilter = new challanFilter();

  constructor(public router: ActivatedRoute, public route: Router) {
    this.rowCnt = 1;
    this.getClients();
    this.getDesignts();
    this.getColors();
  }

  ngOnInit() {
    this.router.queryParams.subscribe((params: Params) => {
      this.id = params['id']
      this.action = params['action']
    });

    // if (this.id) {
    //   this.dataService.findById(this.id, this.url)
    //     .subscribe((res: any) => {
    //       this.clientChallanObj = res;
    //     })
    // }
  }

  //fetch client list

  getClients = () => {
    this.dataService.get('clients')
      .subscribe((res: any) => {
        this.clients = res.data;
      })
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
  colDefs: ColDef<any>[] = [
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
      headerName: 'Quantity',
      editable: true, // 👈 make this column editable
      cellEditor: 'agTextCellEditor' // default is already agTextCellEditor
    },
    {
      headerName: 'Action',
      cellRenderer: this.buttonRenderer,
      cellRendererParams: {
        onClick: this.onDeconsteItem.bind(this),
        label: 'Delete'
      },
      width: 120
    }
  ];

  buttonRenderer(params: any): HTMLElement {
    const button = document.createElement('button');
    button.innerHTML = params.label || 'Click';
    button.classList.add('btn', 'btn-sm', 'btn-primary');
    button.addEventListener('click', () => params.onClick?.(params));
    return button;
  }

  onDeconsteItem(params: any) {
    const rowData = params.data;
    this.gridApi.applyTransaction({ remove: [rowData] });
    const index = this.items.findIndex(item => item.id === rowData.id);
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

  onCellValueChanged(event: any): void {

  }

  save = () => {
    const obj = this.buildRequestObject();

    this.dataService.post(this.url, obj).subscribe((res: any) => {
      if (res.status === 'success') {

        this.successMessage = 'Data saved successfully!';
        this.showSuccessMessage = true;
        this.clientChallanObj = new clientChallan();
        setTimeout(() => {
          this.showSuccessMessage = false;
          this.successMessage = '';
        }, 3000);
        this.items = [];
      } else {
        console.log(res.message)
      }
    })
  }

  onChallanNumberChange() {
    const isChallanSame = this.filterObj.challannumber == this.clientChallanObj.challanNumber
    this.isDuplicateChallan = isChallanSame ? true : false;
  }

  onSave = () => {

    this.filterObj.challannumber = this.clientChallanObj.challanNumber
    const finalUrl = this.url + this.utilsService.buildUrl(this.filterObj);
    this.dataService.get(finalUrl)
      .subscribe((res: any) => {
        if (res.data.length <= 0) {
          this.save()
        } else {
          this.isDuplicateChallan = true
        }
      })
  }

  private buildRequestObject(): any {
    return {
      challanNumber: this.clientChallanObj.challanNumber,
      challanDate: this.utilsService.formatDate_dd_MM_YYYY(this.challanDate),
      client: { id: this.clients.find(e => e.clientName == this.selectedClient)?.id },
      challanType: this.clientChallanObj.challanType,
      challanItems: this.items.map(item => ({
        design: { id: item.designId },
        color: { id: item.colorId },
        quantity: item.quantity
      }))
    };
  }

  updateForm = (key: string, event: any) => {
    this.clientChallanFromData.update((data: clientChallan) =>
      ({ ...data, [key]: event.target.value })
    )
  }

  cancel = () => {
    this.route.navigate(["/lsit-client-challan"])
  }

  getDesignName = (id: number) => {
    return this.designs.filter(e => e.id == id)[0].designName;
  }
  getColorName = (id: number) => {
    return this.colors.filter(e => e.id == id)[0].colorName;
  }

  onGridReady(params: GridReadyEvent): void {
    console.log('calling on grid ready function')
    this.gridApi = params.api;
  }

  getRowId(params: any): string {
    return params.data.id// `${params.data.designId}-${params.data.colorId}`;
  }

  addItems = () => {
    if (this.itemExist()) {
      this.isItemExist = true;
    } else {
      const { design, color, quantity } = this.clientChallanObj;
      const newItem = {
        id: this.rowCnt++,
        designId: design,
        designName: this.getDesignName(design),
        colorId: color,
        colorName: this.getColorName(color),
        quantity
      }

      this.items.push(newItem);
      console.log(this.clientChallanObj, 'this.items', this.items)
      this.gridApi.applyTransaction({ remove: this.items });
      this.gridApi.applyTransaction({ add: this.items });
      this.clearItemInputs();
      this.isItemExist = false;
    }
  }

  clearItemInputs() {
    this.clientChallanObj.design = 0;
    this.clientChallanObj.color = 0
    this.clientChallanObj.quantity = 0
    this.disableAdd = true;
  }

  itemExist() {
    return this.items.some(e => e.designId == this.clientChallanObj.design && e.colorId == this.clientChallanObj.color)
  }

  onInputBlur(): void {
    this.clientChallanObj.quantity = Number(this.clientChallanObj.quantity)
    this.isItemExist = this.itemExist();
    const { design, color, quantity } = this.clientChallanObj;
    this.disableAdd = !(design && color && quantity > 0 && !this.isItemExist);
  }

  challanTypes = this.utilsService.challanTypes;

  selectedParty(selectedParty: any) {
    const obj: client | undefined = this.clients.find(e => e.clientName == selectedParty);
  }

}
