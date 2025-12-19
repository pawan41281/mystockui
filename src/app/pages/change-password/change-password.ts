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

@Component({
  selector: 'app-change-password',
  imports: [CardComponent, FormsModule, CommonModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss'
})
export class ChangePassword implements OnInit {


  private utilsService: UtilService = inject(UtilService);
  private dataService = inject(DataService);
  private router = inject(Router);
  private url: string = 'users/updatepassword';
  isPwdNotMatch: boolean = false
  resetPwd: resetPassword = new resetPassword();
  userInfo: userData;
  saveLabel: string = "Save"
  errorMsg: string = '';

  delObj: design = new design();
  colorObj1: Promise<ResponseData>;

  ngOnInit(): void {
    this.userInfo = this.utilsService.getCurrentUserInfo()
  }


  matchPwd = () => {
    this.isPwdNotMatch = this.resetPwd.newPassword != this.resetPwd.confirmPassword;
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
          alert(res.message)
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



}
