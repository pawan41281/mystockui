import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { UtilService } from 'src/app/services/util-service';
import { design } from 'src/app/model/design';
import { DataService } from 'src/app/services/data-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ResponseData } from 'src/app/model/Response';
import { requestResponse } from 'src/app/model/requestResponse';
import { userData } from 'src/app/model/userData';
import { resetPassword } from 'src/app/model/resetPassword';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-change-password',
  imports: [CardComponent, FormsModule, CommonModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss'
})
export class ChangePassword implements OnInit {

  @ViewChild('exampleModal') exampleModal!: ElementRef;

  private utilsService: UtilService = inject(UtilService);
  private dataService = inject(DataService);
  private router = inject(Router);
  private url: string = 'users/updatepassword';
  isPwdNotMatch: boolean = false
  resetPwd: resetPassword = new resetPassword();
  userInfo: userData;
  saveLabel: string = "Save"
  errorMsg: string = '';
  successMsg: string = ''
  processLogout: boolean = false;
  delObj: design = new design();
  colorObj1: Promise<ResponseData>;

  ngOnInit(): void {
    this.userInfo = this.utilsService.getCurrentUserInfo()
  }


  matchPwd = () => {
    this.isPwdNotMatch = this.resetPwd.newPassword != this.resetPwd.confirmPassword;
  }

  showConfirmation = () => {
    this.errorMsg = '';
    this.isPwdNotMatch = this.resetPwd.newPassword != this.resetPwd.confirmPassword;
    if (this.isPwdNotMatch) {
      this.errorMsg = "password and confirm password should be same"
      return
    }
    const modal = new bootstrap.Modal(this.exampleModal.nativeElement);
    modal.show();
  }

  onSave = () => {
    const obj = {
      'id': this.userInfo.id,
      'oldPassword': this.resetPwd.oldPassword,
      'newPassword': this.resetPwd.newPassword
    }
    this.dataService.update(this.url, obj)
      .subscribe((res: requestResponse) => {
        if (res.status === 'success') {
          this.successMsg = res.message;
          this.logout()
        } else {
          this.errorMsg = res.message
        }
      })
    this.saveLabel = "Save"
  }

  logout = () => {
    this.dataService.post('auth/logout', null)
      .subscribe((res: any) => {
        if (res.status === 'success') {
          localStorage.clear();
          this.router.navigate(['']);
        }
      })
  }

  closePopup = () => {
    const modal = new bootstrap.Modal(this.exampleModal.nativeElement);
    modal.hide();
  }

}
