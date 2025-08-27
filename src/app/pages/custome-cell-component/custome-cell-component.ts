import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UtilService } from 'src/app/services/util-service';

@Component({
  selector: 'app-custome-cell-component',
  imports: [CommonModule],
  templateUrl: './custome-cell-component.html',
  styleUrl: './custome-cell-component.scss'
})
export class CustomeCellComponent {

  param: any = '';
  http = inject(HttpClient)
  utilService = inject(UtilService)
  pageList: any;
  pageData: any;
  isViewVisible: boolean = true;

  constructor(public router: Router) {
    if (this.pageList || this.pageData) {
      this.getJSON().subscribe(data => {
        this.pageList = data;
        this.pageList.forEach((page: any) => {
          if (page[this.param.page.name]) {
            this.pageData = page[this.param.page.name];
          }
        });
      });
    }
  }

  agInit(params: ICellRendererParams): void {
    this.refresh(params);
    this.param = params
    if (this.param.page.name === 'color') {
      this.isViewVisible = false;
    } else {
      this.isViewVisible = true
    }
  }

  refresh(params: ICellRendererParams) {
    const delay = 50;
    const start = Date.now();
    while (Date.now() - start < delay) {
      // Busy-waiting loop to simulate a delay
    }
    return true;
  }
  public getJSON(): Observable<any> {
    return this.http.get("assets/config/pageInf.json");
  }


  edit() {
    this.utilService.commondata.data = this.param.data;
    this.utilService.commondata.action = 'edit'
    this.utilService.commondata.page = this.param.page.name

    //this.router.navigate([this.pageData.new], { queryParams: { id: this.param.data.id, status: this.param.data.active, action: 'edit', page: this.param.page.name } })
  }

  deleteClient() {
    this.utilService.commondata.data = this.param.data;
    this.utilService.commondata.action = 'delete'
    this.utilService.commondata.page = this.param.page.name
    //this.router.navigate([this.pageData.list], { queryParams: { id: this.param.data.id, status: this.param.data.active, action: 'edit', page: this.param.page.name } })
  }

  viewClient(): void {

    this.router.navigate([this.pageData.new], { queryParams: { id: this.param.data.id, status: this.param.data.active, action: 'view', page: this.param.page.name } });
  }
}
