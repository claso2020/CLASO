import { Component, OnInit, Inject, ViewChild, ElementRef  } from '@angular/core';
import { DlgTrabajandoComponent } from '../dlg-trabajando/dlg-trabajando.component';
import { DlgErrorComponent } from '../dlg-error/dlg-error.component';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { MatDialog} from '@angular/material';
import {Router} from "@angular/router"
import {SESSION_STORAGE, WebStorageService} from 'angular-webstorage-service';
import {Location} from '@angular/common';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material'
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-busquedas',
  templateUrl: './busquedas.component.html',
  styleUrls: ['./busquedas.component.css']
})
export class BusquedasComponent implements OnInit {
  lblTitBusqueda="";
  codBusqueda="";
  txtBusc="";
  dialogoActual=MatDialog;
  displayedColumnsLIBROEDITORIAL: string[] = ['nombre'];
  dataSourceLIBROEDITORIAL = new MatTableDataSource();
  @ViewChild(MatPaginator, {static: true}) paginador: MatPaginator;
  escondeTabla: boolean = true;

  constructor(
    public dialog: MatDialog,
    private httpClient: HttpClient,
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: WebStorageService,
    public thisDialogRef: MatDialogRef<BusquedasComponent>    
  ) { }

  ngOnInit() {
    if (this.codBusqueda=="LIBROEDITORIAL"){
      this.buscarEditorial();
    }
  }

  buscarTxt(){
    if (this.codBusqueda=="LIBROEDITORIAL"){
      this.buscarEditorial();
    }
  }

  buscarEditorial(){
    let dlgTrabajando = this.dialog.open(DlgTrabajandoComponent, {
      width: '600px',
      disableClose:true
    });
    dlgTrabajando.componentInstance.titulo="";
    dlgTrabajando.componentInstance.texto="Buscando las editoriales";
    this.httpClient.get(environment.servidorHttp+'Sistema/leerEditoriales'
      ,{
        params: {
          "idConexion": this.storage.get("idConexion"),
          "cadena": this.txtBusc,
          "habilitados":"1"
        },
        headers:{
          "Authorization":'Bearer ' + this.storage.get("token"),
        }
      })
    .subscribe(data => {
      this.cerrarDialogo(dlgTrabajando);
      if (data['resultado']['msgError']['valorDevuelto']=="01"){
        let dlgError = this.dialog.open(DlgErrorComponent, {
          width: '600px',
          disableClose:true
        });
        dlgError.componentInstance.titulo="Error al buscar las editoriales";
        dlgError.componentInstance.texto=data['resultado']['msgError']['mensaje'];
      }else if (data['resultado']['msgError']['valorDevuelto']=="10"){
        let dlgError = this.dialog.open(DlgErrorComponent, {
          width: '600px',
          disableClose:true
        });
        dlgError.componentInstance.titulo="Error al buscar las editoriales";
        dlgError.componentInstance.texto=data['resultado']['msgError']['mensaje'];
        this.router.navigate(['/']);
        delete this.storage;
      }else{
        if (data['resultado']['datos']==undefined){
          this.escondeTabla=true;
          return;
        }
        this.escondeTabla=false;
        this.dataSourceLIBROEDITORIAL = new MatTableDataSource<any>(data['resultado']['datos']);
        this.dataSourceLIBROEDITORIAL.paginator = this.paginador;
        this.paginador._intl.itemsPerPageLabel = 'Editoriales por hoja';
        this.paginador._intl.nextPageLabel  = 'Proxima hoja';
        this.paginador._intl.previousPageLabel  = 'Hoja anterior';
        this.paginador._intl.lastPageLabel  = 'Última hoja';
        this.paginador._intl.firstPageLabel  = 'Primera hoja';
        this.paginador._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
          return 'De '+((page * pageSize) + 1) + ' a ' + ((page * pageSize) + pageSize) + ' de ' + length; 
        }
      }
    },
    (error: HttpErrorResponse) => {
      this.cerrarDialogo(dlgTrabajando);
      let dlgError = this.dialog.open(DlgErrorComponent, {
        width: '600px',
        disableClose:true
      });
      if (error.status.toString()=="401"){
        dlgError.componentInstance.titulo="Error al buscar las editoriales";
        dlgError.componentInstance.texto="Su sesión ha finalizado";
        this.router.navigate(['/']);
        delete this.storage;
      }else{
        dlgError.componentInstance.titulo="Error al buscar las editoriales";
        dlgError.componentInstance.texto=error.message+" ("+error.status+")";
      }
    });
  }

  seleccionarFila(fila){
    this.thisDialogRef.close(fila);
  }

  cerrarDialogo(dialogoActual) {
    dialogoActual.close();
  }
}
