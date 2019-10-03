import { AngularMaterialModule } from './otros/angular-material.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { BusquedasComponent } from './components/busquedas/busquedas.component';
import { DlgAvisoComponent } from './components/dlg-aviso/dlg-aviso.component';
import { DlgErrorComponent } from './components/dlg-error/dlg-error.component';
import { DlgTrabajandoComponent } from './components/dlg-trabajando/dlg-trabajando.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatCardModule, MatDialogModule, MatIconModule, MatSidenavModule, MatToolbarModule, MatListModule
  , MatTableModule, MatPaginatorModule, MatFormFieldModule, MatSortModule, MatTabsModule
  , MatExpansionModule, MatDatepickerModule, MatNativeDateModule, MAT_DATE_LOCALE} from '@angular/material';
import { MatTableExporterModule } from 'mat-table-exporter'
import {MatTooltipModule} from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { StorageServiceModule} from 'angular-webstorage-service';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { InicioComponent } from './inicio/inicio.component';
import { StockComponent } from './stock/stock.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { EditorialesComponent } from './editoriales/editoriales.component';
import { EditorialesModComponent } from './editoriales-mod/editoriales-mod.component';
import { LibrosComponent } from './libros/libros.component';
import { AutoresComponent } from './autores/autores.component';
import { AutoresModComponent } from './autores-mod/autores-mod.component';
import { LibrosModComponent } from './libros-mod/libros-mod.component';

@NgModule({
  declarations: [
    AppComponent,
    AppLayoutComponent,
    AutoresComponent,
    AutoresModComponent,
    BusquedasComponent,
    DlgAvisoComponent,
    DlgErrorComponent,
    DlgTrabajandoComponent,
    EditorialesComponent,
    EditorialesModComponent,
    InicioComponent,
    LoginComponent,
    LibrosComponent,
    LibrosModComponent,
    ParametrosComponent,
    StockComponent,
  ],
  imports: [
    AngularMaterialModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatSidenavModule,
    MatSortModule,
    MatListModule,
    MatPaginatorModule,
    MatTableExporterModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule ,
    MatTooltipModule,
    StorageServiceModule,
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    BusquedasComponent,
    DlgAvisoComponent,
    DlgErrorComponent,
    DlgTrabajandoComponent,
  ]
})
export class AppModule { }
