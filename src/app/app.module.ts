import { AngularMaterialModule } from './otros/angular-material.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DlgErrorComponent } from './components/dlg-error/dlg-error.component';
import { DlgTrabajandoComponent } from './components/dlg-trabajando/dlg-trabajando.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import {MatDialogModule, MatTabsModule, MatExpansionModule, MatDatepickerModule
  , MatNativeDateModule, MAT_DATE_LOCALE} from '@angular/material';
import { NgModule } from '@angular/core';
import { StorageServiceModule} from 'angular-webstorage-service';
import { InicioComponent } from './inicio/inicio.component';

@NgModule({
  declarations: [
    AppComponent,
    DlgErrorComponent,
    DlgTrabajandoComponent,
    LoginComponent,
    InicioComponent,
  ],
  imports: [
    AngularMaterialModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,    
    StorageServiceModule,
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DlgErrorComponent,
    DlgTrabajandoComponent,
  ]
})
export class AppModule { }
