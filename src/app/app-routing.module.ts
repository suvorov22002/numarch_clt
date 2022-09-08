import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AdminComponent } from './component/admin/admin.component';
import { BodyComponent } from './component/body/body.component';
import { ConfigurationsComponent } from './component/configurations/configurations.component';
import { ListDocxComponent } from './component/list-docx/list-docx.component';
import { LoginComponent } from './component/login/login.component';
import { ParamsComponent } from './component/params/params.component';
import { PropertiesComponent } from './component/properties/properties.component';
import { RobotComponent } from './component/robot/robot.component';
import { UrlComponent } from './component/url/url.component';


const routes: Routes = [
 
  {
    path:"",
    component: AdminComponent,
    children:[
      {
        path:"configs",
        component: ConfigurationsComponent
      },
      {
        path:"configs/consultation",
        component: ListDocxComponent
      },
      {
        path:"configs/parameter",
        component: ParamsComponent
      },
      {
        path:"configs/properties",
        component: PropertiesComponent
      },
      {
        path:"configs/service",
        component: UrlComponent
      },
      {
        path:"configs/robot",
        component: RobotComponent
      },
      {
        path:"login",
        component: LoginComponent
      },
      {
        path:'body',
        component: BodyComponent
      //  canActivate: [NgxPermissionsGuard],
     //   data: {
     //     permissions: {
     //       only:['NUMARCH_PROCESS','NUMARCH_ADMIN']
     //     }
     //   }
      },
      {
        path:"**",
        redirectTo: ""
      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
