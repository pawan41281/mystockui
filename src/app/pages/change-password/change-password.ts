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
import { CommonService } from 'src/app/services/common-service';
import { resetPassword } from 'src/app/model/resetPassword';

@Component({
  selector: 'app-change-password',
  imports: [CardComponent, FormsModule, CommonModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss'
})
export class ChangePassword implements OnInit {


  private utilsService: UtilService = inject(UtilService);
  private dataService = inject(DataService);
  private commonService = inject(CommonService)
  private url: string = 'colors';

  isSameEditObj: boolean = false
  resetPwd: resetPassword = new resetPassword();
  userInfo: userData;
  saveLabel: string = "Save"

  delObj: design = new design();
  colorObj1: Promise<ResponseData>;

  ngOnInit(): void {
    this.userInfo = this.utilsService.getCurrentUserInfo()
  }





  onSave = () => {
    // if (this.saveLabel == "Save")
    //   this.colorObj.user.id = this.userInfo.id;

    // this.dataService.post(this.url, this.colorObj)
    //   .subscribe((res: requestResponse) => {
    //     if (res.status === 'success') {
    //       //this.colorObj = new color();
    //       //this.getColorData();
    //     }
    //   })
    this.saveLabel = "Save"
  }




}
