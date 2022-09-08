import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { HeaderComponent } from './component/header/header.component';
import { BodyComponent } from './component/body/body.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AfbcoreModule, AfbcoreService } from 'afbcore';
import { DocumentFolderComponent } from './component/document-folder/document-folder.component';
import { DocumentPropertyComponent } from './component/document-property/document-property.component';
import { DocumentViewerComponent } from './component/document-viewer/document-viewer.component';
import { MatButtonModule, MatIconModule, MatSnackBarModule, MatTableModule, MatTooltipModule, 
  MatSelectModule, MatInputModule, MatDialogModule, MatStepperModule, MatRadioButton, 
  MatRadioModule, MatDatepickerModule, MatSlideToggle, MatSliderModule, MatSlideToggleModule,
   MatNativeDateModule, MatCardModule, MatDividerModule, MatTabsModule, MatListModule, MatFormFieldModule, MatAutocompleteModule, MatToolbarModule, MAT_DATE_LOCALE, MAT_LABEL_GLOBAL_OPTIONS, MatBadgeModule, MatCheckboxModule } from '@angular/material';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import {TableModule} from 'primeng/table';
import { FilterService} from 'primeng/api';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UploadFilesComponent } from './component/upload-files/upload-files.component';
import { UploadFilesService } from './service/upload-files.service';
import { HttpClientModule } from '@angular/common/http';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { VFilesComponent } from './component/v-files/v-files.component';
import { AdminComponent } from './component/admin/admin.component';
import { ConfigurationsComponent } from './component/configurations/configurations.component';
import { LoginComponent } from './component/login/login.component';
import { DocumentService } from './service/document.service';
import { PropertiesService } from './service/properties.service';
import { TypeDocumentsService } from './service/type-documents.service';
import { AppConfigService } from './service/helper/app-config.service';
import { ToastService } from './service/helper/toast.service';
import { ShareService } from './service/share.service';
import { PropertiesFormComponent } from './component/properties-form/properties-form.component';
//import { ProgressSpinnerComponent } from './component/progress-spinner/progress-spinner.component';
import { ProgressSpinnerModule } from './component/progress-spinner/progress-spinner.module';
import {DialogService, DynamicDialogModule} from 'primeng/dynamicdialog';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { OverlayService } from './service/overlay.service';
import { ListDocxComponent } from './component/list-docx/list-docx.component';
import { ParamsComponent } from './component/params/params.component';
import { PropertiesComponent } from './component/properties/properties.component';
import { UrlComponent } from './component/url/url.component';
import { ParamformComponent } from './component/paramform/paramform.component';
import { ViewDocumentComponent } from './component/view-document/view-document.component';
import  {  PdfViewerModule  }  from  'ng2-pdf-viewer';
import { AppInitService } from './service/app-init.service';
import { APP_BASE_HREF } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { MenuComponent } from './component/menu/menu.component';
import { BodereauComponent } from './component/bodereau/bodereau.component';
import { RouteReuseStrategy } from '@angular/router';
import { RouteStrategy } from './service/helper/route-strategy';
import { NgxPermissionsModule } from 'ngx-permissions';
import { RobotComponent } from './component/robot/robot.component';




export function initApp(appInitService:AppInitService){
  return (): Promise<any> => {
    return appInitService.init();
  }
}

var SERVICES = [
  UploadFilesService,
  DocumentService,
  PropertiesService,
  TypeDocumentsService,
  AppConfigService,
  ToastService,
  ShareService,
  OverlayService

]

@NgModule({
  
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    BodyComponent,
    DocumentFolderComponent,
    DocumentPropertyComponent,
    DocumentViewerComponent,

    UploadFilesComponent,
    VFilesComponent,
    ConfigurationsComponent,
    LoginComponent,
    AdminComponent,
    PropertiesFormComponent,
  //  ProgressSpinnerComponent,
    ListDocxComponent,
    ParamsComponent,
    PropertiesComponent,
    UrlComponent,
    ParamformComponent,
    ViewDocumentComponent,
    MenuComponent,
    BodereauComponent,
    RobotComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AfbcoreModule,
    MatButtonModule,
    MatBadgeModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatSelectModule,
    
    MatInputModule,
    MatDialogModule,
    MatStepperModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatNativeDateModule,
    MatCardModule,
    MatDividerModule,
    TableModule,
    DynamicDialogModule,
   // ProgressSpinnerModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatTabsModule,
    MatListModule,
    MatFormFieldModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    PortalModule,
    ScrollingModule,
    MatAutocompleteModule,
    NgxDocViewerModule,
    MatToolbarModule,
    HttpClientModule,
    MaterialFileInputModule,
    PdfViewerModule,
    NgxPermissionsModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    })

    
  ],
  entryComponents: [
    AppComponent,
    //ProgressSpinnerComponent,
    ParamformComponent,ViewDocumentComponent
  ],
  providers: [
    ...SERVICES,
    FilterService,
    AfbcoreService,
    DialogService,
  //  {provide: APP_INITIALIZER, useFactory: initApp, deps: [AppInitService], multi: true},
    {provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: {float: 'always'} },
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
  //  {
  //    provide: RouteReuseStrategy,
  //    useClass: RouteStrategy
  //  },
    {provide: APP_BASE_HREF, useValue: ''}
  ],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
