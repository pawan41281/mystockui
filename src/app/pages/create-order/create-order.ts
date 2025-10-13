import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
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
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { UtilService } from 'src/app/services/util-service';
import { DataService } from 'src/app/services/data-service';
import { order } from 'src/app/model/order';
import { orderFilter } from 'src/app/model/orderFilger';
import { requestResponse } from 'src/app/model/requestResponse';
import { userData } from 'src/app/model/userData';

@Component({
  selector: 'app-create-order',
  imports: [FormsModule, CommonModule, AgGridAngular, MatDatepickerModule,
    MatNativeDateModule, MatInputModule, CardComponent],
  templateUrl: './create-order.html',
  styleUrl: './create-order.scss'
})
export class CreateOrder implements OnInit {

  id: string = '';
  action: string = '';
  url: string = 'clientorders';
  http = inject(HttpClient)
  clientOrderFromData = signal(new order())
  dataService = inject(DataService)
  clientOrder: order = new order();
  utilsService: UtilService = inject(UtilService);
  router: ActivatedRoute = inject(ActivatedRoute);
  route: Router = inject(Router);
  private gridApi!: GridApi;
  rowCnt: number;
  orderDate: Date = new Date();
  items: any[] = [];
  clients: client[] = [];
  designs: design[] = [];
  colors: color[] = [];
  disableAdd: boolean = true;
  showSuccessMessage: boolean = false;
  successMessage: string = '';
  selectedClient: string = ''
  isItemExist: boolean = false;
  isDuplicateOrder: boolean = false;
  filterObj: orderFilter = new orderFilter();
  userInfo: userData;

  constructor() {
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
    this.userInfo = this.utilsService.getCurrentUserInfo()
    // if (this.id) {
    //   this.dataService.findById(this.id, this.url)
    //     .subscribe((res: any) => {
    //       this.clientOrder = res;
    //     })
    // }
  }

  //fetch client list

  getClients = () => {
    this.dataService.get('clients')
      .subscribe((res: requestResponse) => {
        this.clients = res.data;
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

  onCellValueChanged(): void {

  }

  save = () => {
    const obj = this.buildRequestObject();

    this.dataService.post(this.url, obj).subscribe((res: requestResponse) => {
      if (res.status === 'success') {

        this.successMessage = 'Data saved successfully!';
        this.showSuccessMessage = true;
        this.clientOrder = new order();
        setTimeout(() => {
          this.showSuccessMessage = false;
          this.successMessage = '';
        }, 3000);
        this.items = [];
      }
    })
  }

  onOrderNumberChange() {
    const isOrderSame = this.filterObj.ordernumber == this.clientOrder.orderNumber
    this.isDuplicateOrder = isOrderSame ? true : false;
  }

  onSave = () => {

    this.filterObj.ordernumber = this.clientOrder.orderNumber
    const finalUrl = this.url + this.utilsService.buildUrl(this.filterObj);
    this.dataService.get(finalUrl)
      .subscribe((res: requestResponse) => {
        if (res.data.length <= 0) {
          this.save()
        } else {
          this.isDuplicateOrder = true
        }
      })
  }

  private buildRequestObject() {
    return {
      orderNumber: this.clientOrder.orderNumber,
      orderDate: this.utilsService.formatDate_dd_MM_YYYY(this.orderDate),
      client: { id: this.clients.find(e => e.clientName == this.selectedClient)?.id },
      orderItems: this.items.map(item => ({
        design: { id: item.designId },
        color: { id: item.colorId },
        quantity: item.quantity
      })),
      user: {
        id: this.userInfo.id
      }
    };
  }

  updateForm = (key: string, event: any) => {
    this.clientOrderFromData.update((data: order) =>
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
    this.gridApi = params.api;
  }

  getRowId(params: any): string {
    return params.data.id// `${params.data.designId}-${params.data.colorId}`;
  }

  addItems = () => {
    if (this.itemExist()) {
      this.isItemExist = true;
    } else {
      const { design, color, quantity } = this.clientOrder;
      const newItem = {
        id: this.rowCnt++,
        designId: design,
        designName: this.getDesignName(design),
        colorId: color,
        colorName: this.getColorName(color),
        quantity
      }

      this.items.push(newItem);
      this.gridApi.applyTransaction({ remove: this.items });
      this.gridApi.applyTransaction({ add: this.items });
      this.clearItemInputs();
      this.isItemExist = false;
    }
  }

  clearItemInputs() {
    this.clientOrder.design = 0;
    this.clientOrder.color = 0
    this.clientOrder.quantity = 0
    this.disableAdd = true;
  }

  itemExist() {
    return this.items.some(e => e.designId == this.clientOrder.design && e.colorId == this.clientOrder.color)
  }

  onInputBlur(): void {
    this.clientOrder.quantity = Number(this.clientOrder.quantity)
    this.isItemExist = this.itemExist();
    const { design, color, quantity } = this.clientOrder;
    this.disableAdd = !(design && color && quantity > 0 && !this.isItemExist);
  }

  challanTypes = this.utilsService.challanTypes;

  selectedParty(selectedParty: any) {
    const obj: client | undefined = this.clients.find(e => e.clientName == selectedParty);
  }
}
