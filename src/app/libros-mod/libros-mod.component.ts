import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { DlgTrabajandoComponent } from '../components/dlg-trabajando/dlg-trabajando.component';
import { DlgErrorComponent } from '../components/dlg-error/dlg-error.component';
import { DlgAvisoComponent } from '../components/dlg-aviso/dlg-aviso.component';
import { BusquedasComponent } from '../components/busquedas/busquedas.component';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatTableDataSource, MatPaginator } from '@angular/material';
import {Router} from "@angular/router"
import {SESSION_STORAGE, WebStorageService} from 'angular-webstorage-service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-libros-mod',
  templateUrl: './libros-mod.component.html',
  styleUrls: ['./libros-mod.component.css']
})
export class LibrosModComponent implements OnInit {

  titulo="";
  autor="";
  habilitado=true;
  idActual="";
  txtBuscEditorial="";
  txtISBN="";
  @ViewChild('txtTitulo',null) txtTitulo: ElementRef;
  @ViewChild('txtISBNElement',null) txtISBNElement: ElementRef;
  dataSourceEditoriales = new MatTableDataSource();
  dataSourceISBN = new MatTableDataSource();
  idEditorialActual="";
  lblEditorialActual="";
  ISBN=[];
  escondeTablaISBN=true;
  displayedColumnsISBN: string[] = ['accionesISBN','ISBN'];
  @ViewChild('paginadorISBN', {static: true}) paginadorISBN: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private httpClient: HttpClient,
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: WebStorageService,    
  ) { }

  ngOnInit() {
    this.txtTitulo.nativeElement.focus();
    if (this.storage.get("idConexion")==null){
      this.router.navigate(['/'])
    }
    if (this.storage.get("idGeneral")=="00000000-0000-0000-0000-000000000000"){
      this.titulo="Agregar nuevo libro";
    }else{
      this.titulo="Modificar libro";
    }
    //this.leerDato();
  }

  cerrarDialogo(dialogoActual) {
    dialogoActual.close();
  }

  buscarEditorial(){
    let dlgBusquedas = this.dialog.open(BusquedasComponent, {
      width: window.innerWidth.toString()+"px",
      disableClose:true
    });
    dlgBusquedas.componentInstance.lblTitBusqueda="Editorial:";
    dlgBusquedas.componentInstance.codBusqueda="LIBROEDITORIAL";
    dlgBusquedas.componentInstance.txtBusc=this.txtBuscEditorial;
    dlgBusquedas.afterClosed().subscribe(
      data => {
        this.idEditorialActual=data.idEditorial;
        this.lblEditorialActual=data.nombre;
      }
    ); 
  }

  agregarISBN(){
    if (this.txtISBN==""){
      let dlgError = this.dialog.open(DlgErrorComponent, {
        width: '600px',
        disableClose:true
      });
      dlgError.componentInstance.titulo="Error al agregar ISBN";
      dlgError.componentInstance.texto="El ISBN no puede estar en blanco";
      return;
    }
    this.ISBN.push({"ISBN":this.txtISBN});
    this.txtISBN="";
    this.txtISBNElement.nativeElement.focus();
    this.mostrarISBN();
  }

  mostrarISBN(){
    if (this.ISBN.length==0){
      this.escondeTablaISBN=true;
      return;
    }
    this.escondeTablaISBN=false;
    this.dataSourceISBN = new MatTableDataSource<any>(this.ISBN);
    this.dataSourceISBN.paginator = this.paginadorISBN;
    this.paginadorISBN._intl.itemsPerPageLabel = 'ISBN por hoja';
    this.paginadorISBN._intl.nextPageLabel  = 'Proxima hoja';
    this.paginadorISBN._intl.previousPageLabel  = 'Hoja anterior';
    this.paginadorISBN._intl.lastPageLabel  = 'Última hoja';
    this.paginadorISBN._intl.firstPageLabel  = 'Primera hoja';
    this.paginadorISBN._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      return 'De '+((page * pageSize) + 1) + ' a ' + ((page * pageSize) + pageSize) + ' de ' + length; 
    }
  };

  /* leerDato(){
    let dlgTrabajando = this.dialog.open(DlgTrabajandoComponent, {
      width: '600px',
      disableClose:true
    });
    dlgTrabajando.componentInstance.titulo="";
    dlgTrabajando.componentInstance.texto="Buscando los datos de llibro";

    this.idActual=this.storage.get("idGeneral");
    this.httpClient.get(environment.servidorHttp+'Sistema/leerLibro'
      ,{
        params: {
          "idConexion": this.storage.get("idConexion"),
          "idLibro": this.idActual
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
        dlgError.componentInstance.titulo="Error al buscar el dato del libro";
        dlgError.componentInstance.texto=data['resultado']['msgError']['mensaje'];
      }else if (data['resultado']['msgError']['valorDevuelto']=="10"){
        let dlgError = this.dialog.open(DlgErrorComponent, {
          width: '600px',
          disableClose:true
        });
        dlgError.componentInstance.titulo="Error al buscar el dato libro";
        dlgError.componentInstance.texto=data['resultado']['msgError']['mensaje'];
        this.router.navigate(['/']);
        delete this.storage;
      }else{
        if (data['resultado']['msgError']['nombreAutor']!=null){
          this.autor=data['resultado']['msgError']['nombreAutor'];
        }
        this.habilitado=data['resultado']['msgError']['habilitada']=="1";
      }
    },
    (error: HttpErrorResponse) => {
      this.cerrarDialogo(dlgTrabajando);
      let dlgError = this.dialog.open(DlgErrorComponent, {
        width: '600px',
        disableClose:true
      });
      if (error.status.toString()=="401"){
        dlgError.componentInstance.titulo="Error al buscar el dato del libro";
        dlgError.componentInstance.texto="Su sesión ha finalizado";
        this.router.navigate(['/']);
        delete this.storage;
      }else{
        dlgError.componentInstance.titulo="Error al buscar el dato del libro";
        dlgError.componentInstance.texto=error.message+" ("+error.status+")";
      }
    });
  }

  cerrarDialogo(dialogoActual) {
    dialogoActual.close();
  }

  volver() {
    this.router.navigate(['/autores']);
  }

  almacenar(){
    let dlgTrabajando = this.dialog.open(DlgTrabajandoComponent, {
      width: '600px',
      disableClose:true
    });
    dlgTrabajando.componentInstance.titulo="";
    dlgTrabajando.componentInstance.texto="Intentando almacenar el libro";

    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('idConexion', this.storage.get("idConexion"));
    urlSearchParams.append('idAutor', this.idActual);    
    urlSearchParams.append('nombre', this.autor);    
    urlSearchParams.append('habilitado', String(this.habilitado));    

    let parametros = urlSearchParams.toString()
    this.httpClient.post(environment.servidorHttp+'Sistema/modificarLibro?'+parametros, null,
      {
        headers:{
          "Authorization": "Bearer "+this.storage.get("token")
        },
      })
      .subscribe(data => {
          this.cerrarDialogo(dlgTrabajando);
          if (data['resultado']['msgError']['valorDevuelto']=="01"){
            let dlgError = this.dialog.open(DlgErrorComponent, {
              width: '600px',
              disableClose:true
            });
            dlgError.componentInstance.titulo="Error al almacenar el libro";
            dlgError.componentInstance.texto=data['resultado']['msgError']['mensaje'];
          }else if (data['resultado']['msgError']['valorDevuelto']=="10"){
            let dlgError = this.dialog.open(DlgErrorComponent, {
              width: '600px',
              disableClose:true
            });
            dlgError.componentInstance.titulo="Error al almacenar el libro";
            dlgError.componentInstance.texto=data['resultado']['msgError']['mensaje'];
            this.router.navigate(['/']);
            delete this.storage;
          } else{
            let dlgAviso = this.dialog.open(DlgAvisoComponent, {
              width: '600px',
              disableClose:true
            });
            dlgAviso.componentInstance.titulo="Aviso del sistema";
            dlgAviso.componentInstance.texto=data['resultado']['msgError']['mensaje'];
            this.router.navigate(['/autores']);
          }
        },
        (error: HttpErrorResponse) => {
            this.cerrarDialogo(dlgTrabajando);
            let dlgError = this.dialog.open(DlgErrorComponent, {
              width: '600px',
              disableClose:true
            });
            if (error.status.toString()=="401"){
              dlgError.componentInstance.titulo="Error al almacenar el dato del libro";
              dlgError.componentInstance.texto="Su sesión ha finalizado";
              this.router.navigate(['/']);
              delete this.storage;
            }else{
              dlgError.componentInstance.titulo="Error al almacenar el dato del libro";
              dlgError.componentInstance.texto=error.message+" ("+error.status+")";
            } 
        }
      );
  } */
}