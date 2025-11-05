import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { type GridApi, type GridReadyEvent } from "ag-grid-community";
import { contractor } from '../../model/contractor';
import { challanFilter } from 'src/app/model/challanFilter';
import { UtilService } from 'src/app/services/util-service';
import { clientChallanInfo } from 'src/app/model/clientChallanInfo';
import { DataService } from 'src/app/services/data-service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { CommonModule } from '@angular/common';
import { requestResponse } from 'src/app/model/requestResponse';
import { userData } from 'src/app/model/userData';
import { contractorpayment } from 'src/app/model/contractorpayment';

@Component({
  selector: 'app-contractor-payment-component',
  imports: [FormsModule, CommonModule, MatDatepickerModule,
    MatNativeDateModule, MatInputModule, CardComponent],
  templateUrl: './contractor-payment-component.html',
  styleUrl: './contractor-payment-component.scss'
})
export class ContractorPaymentComponent {



  id: string = '';
  action: string = '';
  url: string = 'contractorpayments';
  http = inject(HttpClient)
  clientChallanFromData = signal(new clientChallanInfo())
  dataService = inject(DataService)
  contractorPyamentObj: contractorpayment = new contractorpayment();
  utilsService: UtilService = inject(UtilService);
  private gridApi!: GridApi;
  rowCnt: number;
  challanDate: Date = new Date();
  items: any[] = [];
  constructors: contractor[] = [];
  disableAdd: boolean = true;
  showSuccessMessage: boolean = false;
  successMessage: string = '';
  filterObj: challanFilter = new challanFilter();
  userInfo: userData;


  constructor() {
    this.rowCnt = 1;
    this.getContractor();
  }

  ngOnInit() {

    if (this.id) {
      this.dataService.get(`${this.id}/${this.url}`)
        .subscribe((res: any) => {
          this.contractorPyamentObj = res;
        })
    }
    this.userInfo = this.utilsService.getCurrentUserInfo()
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }
  //fetch client list

  getContractor = () => {
    this.dataService.get('contractors?active=true')
      .subscribe((res: requestResponse) => {
        this.constructors = res.data;
      })
  }


  save = () => {
    const obj = this.buildReqObj();
    this.dataService.post(this.url, obj)
      .subscribe((res: requestResponse) => {
        if (res.status === 'success') {

          this.successMessage = 'Data saved successfully!';
          this.showSuccessMessage = true;
          this.contractorPyamentObj = new contractorpayment();
          setTimeout(() => {
            this.showSuccessMessage = false;
            this.successMessage = '';
          }, 3000);
          this.items = [];
          //this.cancel();
        }
      })
  }
  // onSave = () => {
  //   console.log('on save call')

  //   const finalUrl = this.url + this.utilsService.buildUrl(this.filterObj);
  //   this.dataService.get(finalUrl)
  //     .subscribe((res: requestResponse) => {
  //       if (res.data.length <= 0) {
  //         this.save()
  //       }
  //     })
  // }

  buildReqObj = () => {

    const obj = {

      "paymentDate": this.utilsService.formatDate_dd_MM_YYYY(this.challanDate),
      "contractor": {
        "id": this.contractorPyamentObj.party
      },
      "paymentAmount": this.contractorPyamentObj.paymentAmount,
      "user": {
        "id": this.userInfo.id
      },
      "remarks": this.contractorPyamentObj.remarks
    }
    return obj;
  }

  // buildItemsData = () => {
  //   let arr: any = []

  //   this.items.forEach(e => {
  //     arr.push({
  //       design: { id: e.designId },
  //       color: { id: e.colorId },
  //       quality: { id: e.quality },
  //       quantity: e.quantity,
  //       rate: e.rate,
  //     });
  //   });
  //   return arr;
  // }

  updateForm = (key: string, event: any) => {
    this.clientChallanFromData.update((data: clientChallanInfo) =>
      ({ ...data, [key]: event.target.value })
    )
  }


  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  onInputBlur = () => {
    // const { design, color, quality, rate } = this.contractorPyamentObj;
    // this.disableAdd = !(design && color && quality && rate && !this.isItemExist);

  }
  challanTypes = [{ val: "I", name: "Issue" }, { val: "R", name: "Recieve" }]
}
