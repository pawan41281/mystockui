import { Component, inject, input, OnInit, output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IconService, IconDirective } from '@ant-design/icons-angular';

import {
  BellOutline,
  SettingOutline,
  GiftOutline,
  MessageOutline,
  PhoneOutline,
  CheckCircleOutline,
  LogoutOutline,
  EditOutline,
  UserOutline,
  ProfileOutline,
  WalletOutline,
  QuestionCircleOutline,
  LockOutline,
  CommentOutline,
  UnorderedListOutline,
  ArrowRightOutline,
  GithubOutline
} from '@ant-design/icons-angular/icons';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { Auth } from 'src/app/model/login';
import { userData } from 'src/app/model/userData';
import { DataService } from 'src/app/services/data-service';
import { UtilService } from 'src/app/services/util-service';

@Component({
  selector: 'app-nav-right',
  imports: [IconDirective, RouterModule, NgScrollbarModule, NgbNavModule, NgbDropdownModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent implements OnInit {
  private iconService = inject(IconService);
  private utilsService = inject(UtilService);
  styleSelectorToggle = input<boolean>();
  dataService = inject(DataService);
  router = inject(Router);
  Customize = output();
  windowWidth: number;
  screenFull: boolean = true;
  userInfo: userData;
  url: string = 'auth/logout';
  auth: Auth = new Auth()

  constructor() {
    this.windowWidth = window.innerWidth;
    this.iconService.addIcon(
      ...[
        CheckCircleOutline,
        GiftOutline,
        MessageOutline,
        SettingOutline,
        PhoneOutline,
        LogoutOutline,
        UserOutline,
        EditOutline,
        ProfileOutline,
        QuestionCircleOutline,
        LockOutline,
        CommentOutline,
        UnorderedListOutline,
        ArrowRightOutline,
        BellOutline,
        GithubOutline,
        WalletOutline
      ]
    );
  }
  ngOnInit(): void {
    this.userInfo = this.utilsService.getCurrentUserInfo()
  }
  profileoptions = [
    {
      icon: 'user',
      title: 'My Profile1111'
    },
    {
      icon: 'email',
      title: 'usertest@data.com'
    }
  ];

  settingoptions = [
    {
      icon: 'setting',
      title: 'Change Password'
    }
  ];

  logout = () => {
    this.dataService.post(this.url, this.auth)
      .subscribe((res: any) => {
        if (res.status === 'success') {
          localStorage.removeItem('access_token');
          //this.getColorData();
          this.router.navigate(['']);
        }
      })
  }
}
