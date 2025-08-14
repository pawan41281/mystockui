// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestLayoutComponent } from './theme/layouts/guest-layout/guest-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard/default',
        pathMatch: 'full'
      },
      {
        path: 'dashboard/default',
        loadComponent: () => import('./demo/dashboard/default/default.component').then((c) => c.DefaultComponent)
      },


      {
        path: 'newcontractorchallan',
        loadComponent: () => import('./demo/others/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      },
      {
        path: 'searchcontractorchallan',
        loadComponent: () => import('./demo/others/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      },
      {
        path: 'newpartychallan',
        loadComponent: () => import('./demo/others/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      },
      {
        path: 'searchpartychallan',
        loadComponent: () => import('./demo/others/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      },




      {
        path: 'stockregister',
        loadComponent: () => import('./pages/stock-register-component/stock-register-component').then((c) => c.StockRegisterComponent)
      },
      {
        path: 'contractorstockregister',
        loadComponent: () => import('./pages/contractor-stock-register-component/contractor-stock-register-component').then((c) => c.ContractorStockRegisterComponent)
      },
      {
        path: 'partychallanregister',
        loadComponent: () => import('./pages/party-challan-register-component/party-challan-register-component').then((c) => c.PartyChallanRegisterComponent)
      },
      {
        path: 'contractorchallanregister',
        loadComponent: () => import('./pages/contractor-challan-register-component/contractor-challan-register-component').then((c) => c.ContractorChallanRegisterComponent)
      },




      {
        path: 'color',
        loadComponent: () => import('./pages/color-component/color-component').then((c) => c.ColorComponent)
      },
      {
        path: 'design',
        loadComponent: () => import('./pages/design-component/design-component').then((c) => c.DesignComponent)
      },
      {
        path: 'party',
        loadComponent: () => import('./pages/party-component/party-component').then((c) => c.PartyComponent)
      },
      {
        path: 'contractor',
        loadComponent: () => import('./pages/color-component/color-component').then((c) => c.ColorComponent)
      },




      {
        path: 'newcolor',
        loadComponent: () => import('./demo/component/basic-component/color/color.component').then((c) => c.ColorComponent)
      },
      {
        path: 'searchcolor',
        loadComponent: () => import('./demo/component/basic-component/color/color.component').then((c) => c.ColorComponent)
      },


      {
        path: 'newuser',
        loadComponent: () => import('./demo/others/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      },
      {
        path: 'searchuser',
        loadComponent: () => import('./demo/others/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      }

      // {
      //   path: 'users',
      //   loadComponent: () => import('./demo/others/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      // }

    ]
  },
  {
    path: '',
    component: GuestLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./demo/pages/authentication/auth-login/auth-login.component').then((c) => c.AuthLoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./demo/pages/authentication/auth-register/auth-register.component').then((c) => c.AuthRegisterComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
