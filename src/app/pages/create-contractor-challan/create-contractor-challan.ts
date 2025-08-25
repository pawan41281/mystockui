import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { type ColDef, type CsvExportParams, type GridApi, type GridReadyEvent } from "ag-grid-community";
import { design } from '../../model/design';
import { color } from '../../model/color';
import { contractor } from '../../model/contractor';
import { challanFilter } from 'src/app/model/challanFilter';
import { UtilService } from 'src/app/services/util-service';
import { contractorChallan } from 'src/app/model/contractorChallan';
import { clientChallanInfo } from 'src/app/model/clientChallanInfo';
import { DataService } from 'src/app/services/data-service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

@Component({
  selector: 'app-create-contractor-challan',
  imports: [FormsModule, CommonModule, AgGridAngular, MatDatepickerModule,
    MatNativeDateModule, MatInputModule, CardComponent],
  templateUrl: './create-contractor-challan.html',
  styleUrl: './create-contractor-challan.scss'
})
export class CreateContractorChallan {

  id: string = '';
  action: string = '';
  url: string = 'contractorchallans';
  http = inject(HttpClient)
  clientChallanFromData = signal(new clientChallanInfo())
  dataService = inject(DataService)
  contractorChallanObj: contractorChallan = new contractorChallan();
  utilsService: UtilService = inject(UtilService);
  private gridApi!: GridApi;
  rowCnt: number;
  challanDate: Date = new Date();
  rowId: string = '';
  items: any[] = [];
  constructors: contractor[] = [];
  designs: design[] = [];
  colors: color[] = [];
  disableAdd: boolean = true;
  isItemExist: boolean = false;
  showSuccessMessage: boolean = false;
  successMessage: string = '';
  isDuplicateChallan: boolean = false;
  filterObj: challanFilter = new challanFilter();


  constructor(public router: ActivatedRoute, public route: Router) {
    this.rowCnt = 1;
    this.getContractor();
    this.getDesignts();
    this.getColors();
  }

  ngOnInit() {
    this.router.queryParams.subscribe((params: Params) => {
      this.id = params['id']
      this.action = params['action']
    });

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
  //fetch client list

  getContractor = () => {
    this.dataService.get('contractors')
      .subscribe((res: any) => {
        this.constructors = res.data;
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

  onCellValueChanged(event: any): void {
    console.log('Cell changed:', event);
    console.log(this.items, 'New row data:', event.data); // updated row
  }

  save = () => {

    let obj = this.buildReqObj();
    this.dataService.post(this.url, obj)
      .subscribe((res: any) => {
        if (res.status === 'success') {

          this.successMessage = 'Data saved successfully!';
          this.showSuccessMessage = true;
          this.contractorChallanObj = new contractorChallan();
          setTimeout(() => {
            this.showSuccessMessage = false;
            this.successMessage = '';
          }, 3000);
          this.items = [];
          //this.cancel();
        } else {
          console.log(res.message)
        }
      })
  }
  onChallanNumberChange() {
    const isChallanSame = this.filterObj.challannumber == this.contractorChallanObj.challanNumber
    this.isDuplicateChallan = isChallanSame ? true : false;
  }

  onSave = () => {

    this.filterObj.challannumber = this.contractorChallanObj.challanNumber
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

  buildReqObj = () => {

    const obj = {
      "challanNumber": this.contractorChallanObj.challanNumber,
      "challanDate": this.utilsService.formatDate_dd_MM_YYYY(this.challanDate),
      "contractor": {
        "id": this.constructors.find(e => e.contractorName == this.contractorChallanObj.party)?.id
      },
      "challanType": this.contractorChallanObj.challanType,
      "challanItems": this.buildItemsData()
    }
    return obj;
  }

  buildItemsData = () => {
    let arr: any = []

    this.items.forEach(e => {
      console.log(e)
      arr.push({
        design: { id: e.designId },
        color: { id: e.colorId },
        quantity: e.quantity,
      });
    });
    return arr;
  }

  updateForm = (key: string, event: any) => {
    this.clientChallanFromData.update((data: clientChallanInfo) =>
      ({ ...data, [key]: event.target.value })
    )
  }

  // cancel = () => {
  //   this.route.navigate(["/list-contractor-challan"])
  // }

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
    return this.items.some(e => e.designId == this.contractorChallanObj.design && e.colorId == this.contractorChallanObj.color)
  }

  addItems = () => {

    if (this.itemExist()) {
      this.isItemExist = true;
    } else {

      this.items.push({
        'id': this.rowCnt++,
        'designId': this.contractorChallanObj.design,
        'designName': this.getDesignName(this.contractorChallanObj.design),
        'colorId': this.contractorChallanObj.color,
        'colorName': this.getColorData(this.contractorChallanObj.color),
        'quantity': this.contractorChallanObj.quantity
      })
      this.gridApi.applyTransaction({ remove: this.items });
      this.gridApi.applyTransaction({ add: this.items });
      this.clearItems();
      this.isItemExist = false;
    }
  }

  clearItems() {
    this.contractorChallanObj.design = 0;
    this.contractorChallanObj.color = 0
    this.contractorChallanObj.quantity = 0
    this.disableAdd = true;
  }

  onInputBlur = () => {
    this.contractorChallanObj.quantity = Number(this.contractorChallanObj.quantity)
    this.isItemExist = this.itemExist();
    const { design, color, quantity } = this.contractorChallanObj;
    this.disableAdd = !(design && color && quantity > 0 && !this.isItemExist);

  }
  challanTypes = [{ val: "I", name: "Issue" }, { val: "R", name: "Recieve" }]
}
