import { Component, inject, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { UtilService } from 'src/app/services/util-service';
import { DataService } from 'src/app/services/data-service';
import { DownloadSerivceService } from 'src/app/services/download-serivce-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { userData } from 'src/app/model/userData';
import { user } from 'src/app/model/user';

@Component({
  selector: 'app-user-component',
  imports: [CardComponent, AgGridAngular, FormsModule, CommonModule],
  templateUrl: './user-component.html',
  styleUrl: './user-component.scss'
})
export class UserComponent implements OnInit {


  id: string = '';
  action: string = '';
  url: string = 'users';
  userObj: user = new user();
  dataService = inject(DataService);
  utilsService: UtilService = inject(UtilService);
  downloadService = inject(DownloadSerivceService)
  route = inject(Router)

  showStatus: boolean = false;
  private gridApi!: GridApi;
  user_data: user[] = [];
  totalRecord: number = 0;
  showSuccessMessage: boolean = false;
  successMessage: string = '';
  userInfo: userData;


  ngOnInit() {
    this.searchUser()
    this.userInfo = this.utilsService.getCurrentUserInfo()
  }


  colDefs: ColDef<user>[] = [
    {
      headerName: "User ID",
      field: "userId",
    },
    {
      headerName: "Name",
      field: "name",
    },
    {
      headerName: "Mobile",
      field: "mobile",
    },
    {
      headerName: "Email",
      field: "email",
    },
    {
      headerName: "Role",
      field: "role",
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
    this.downloadService.exportToCSV(this.getReportData(), 'user_data.csv')
  }

  onBtnExportExcel() {
    this.downloadService.exportToExcel(this.getReportData(), 'user_data.xlsx')
  }

  getReportData() {
    return this.user_data.map(e => ({
      'User ID': e.userId,
      'User Name': e.name,
      'Email': e.email,
      'Mobile': e.mobile,
      'Role': e.role
    }));
  }

  save(): void {

    this.dataService.post(this.url, this.userObj).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.successMessage = 'Data saved successfully!';
          this.showSuccessMessage = true;
          this.userObj = new user();
          this.searchUser();
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

  searchUser = () => {

    this.dataService.get(this.url)
      .subscribe((res: any) => {
        this.user_data = res.data;
        this.totalRecord = res.metadata.recordcount;
      })
  }

  // deleteClient() {
  //   this.dataService.patch(this.url, this.userObj.userId)
  //     .subscribe((res: any) => {
  //       this.user_data[0] = res;
  //       this.searchUser();
  //     })
  // }

}
