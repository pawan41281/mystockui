import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { clientChallan } from '../../model/clientChallan';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { type ColDef, type GridApi, type GridReadyEvent } from "ag-grid-community";
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
import { requestResponse } from 'src/app/model/requestResponse';
import { order } from 'src/app/model/order';
import { userData } from 'src/app/model/userData';
import { quality } from 'src/app/model/quality';

@Component({
  selector: 'app-create-party-challan',
  imports: [CardComponent, FormsModule, CommonModule, AgGridAngular, MatDatepickerModule,
    MatNativeDateModule, MatInputModule],
  templateUrl: './create-party-challan.html',
  styleUrl: './create-party-challan.scss'
})
export class CreatePartyChallan implements OnInit {


  id: string = '';
  action: string = '';
  url: string = 'clientchallans';
  http = inject(HttpClient)
  clientChallanFromData = signal(new clientChallan())
  dataService = inject(DataService)
  clientChallanObj: clientChallan = new clientChallan();
  utilsService: UtilService = inject(UtilService);
  router: ActivatedRoute = inject(ActivatedRoute);
  route: Router = inject(Router);
  private gridApi!: GridApi;
  rowCnt: number;
  challanDate: Date = new Date();
  items: any[] = [];
  clients: client[] = [];
  designs: design[] = [];
  colors: color[] = [];
  orders: order[] = [];
  disableAdd: boolean = true;
  showSuccessMessage: boolean = false;
  successMessage: string = '';
  selectedClient: string = ''
  isItemExist: boolean = false;
  isDuplicateChallan: boolean = false;
  filterObj: challanFilter = new challanFilter();
  userInfo: userData;
  qualityList: quality[] = [];

  constructor() {
    this.rowCnt = 1;
    this.getClients();
    this.getDesignts();
    this.getColors();
    this.getQualityList();

  }

  ngOnInit() {
    this.router.queryParams.subscribe((params: Params) => {
      this.id = params['id']
      this.action = params['action']
    });

    this.userInfo = this.utilsService.getCurrentUserInfo()
  }

  // fetch color list
  getQualityList = () => {
    this.dataService.get('quality?active=true')
      .subscribe((res: requestResponse) => {
        this.qualityList = res.data;
      })
  }

  //fetch client list
  getClients = () => {
    this.dataService.get('clients?active=true')
      .subscribe((res: requestResponse) => {
        this.clients = res.data;
      })
  }

  //fethc design list

  getDesignts = () => {
    this.dataService.get('designs?active=true')
      .subscribe((res: requestResponse) => {
        this.designs = res.data;
      })
  }

  // fetch color list
  getColors = () => {
    this.dataService.get('colors?active=true')
      .subscribe((res: requestResponse) => {
        this.colors = res.data;
      })
  }


  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<any>[] = [
    {
      headerName: 'Quality',
      field: 'qualityName'
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
      headerName: 'Quantity',
      field: 'quantity',
      editable: true, // 👈 make this column editable
      cellEditor: 'agTextCellEditor' // default is already agTextCellEditor
    },
    {
      headerName: 'Rate',
      field: 'rate',
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

  myCellRendererAction(params: any) {
    console.log('params :: ', params)
    return this.qualityList.filter(e => e.id == params.data.quality)[0].qualityName;
  }

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

  onCellValueChanged(): void {

  }

  save = () => {
    const obj = this.buildRequestObject();

    this.dataService.post(this.url, obj).subscribe((res: requestResponse) => {
      if (res.status === 'success') {

        this.successMessage = 'Data saved successfully!';
        this.showSuccessMessage = true;
        this.clientChallanObj = new clientChallan();
        setTimeout(() => {
          this.showSuccessMessage = false;
          this.successMessage = '';
        }, 3000);
        this.items = [];
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
    let obj = {
      challanNumber: this.clientChallanObj.challanNumber,
      challanDate: this.utilsService.formatDate_dd_MM_YYYY(this.challanDate),
      client: { id: this.selectedClient },

      challanType: this.clientChallanObj.challanType,
      challanItems: this.items.map(item => ({
        quality: { id: item.qualityId },
        design: { id: item.designId },
        color: { id: item.colorId },
        quantity: item.quantity,
        rate: item.rate
      })),
      user: {
        id: this.userInfo.id
      }
    };

    if (this.clientChallanObj.orderNumber) {
      obj['order'] = { id: this.clientChallanObj.orderNumber }
    }

    return obj;
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

  getQualityName = (id: number) => {
    return this.qualityList.filter(e => e.id == id)[0].qualityName;
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  getRowId(params: any): string {
    return params.data.id// `${params.data.designId}-${params.data.colorId}`;
  }

  addItems = () => {
    if (this.itemExist()) {
      this.isItemExist = true;
    } else {
      const { quality, design, color, quantity, rate } = this.clientChallanObj;
      const newItem = {
        id: this.rowCnt++,
        qualityId: quality,
        qualityName: this.getQualityName(quality),
        designId: design,
        designName: this.getDesignName(design),
        colorId: color,
        colorName: this.getColorName(color),
        quantity: quantity,
        rate: rate
      }

      this.items.push(newItem);
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
    return this.items.some(e => e.designId == this.clientChallanObj.design && e.colorId == this.clientChallanObj.color && e.qualityId == this.clientChallanObj.quality)
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
    this.getOrders();
  }



  // fetch order list
  getOrders = () => {

    this.dataService.get('clientorders?clientid=' + this.selectedClient)
      .subscribe((res: requestResponse) => {
        this.orders = res.data;
      })
  }

}

//clientid