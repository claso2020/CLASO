import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { DlgTrabajandoComponent } from '../components/dlg-trabajando/dlg-trabajando.component';
import { DlgErrorComponent } from '../components/dlg-error/dlg-error.component';
import { DlgAvisoComponent } from '../components/dlg-aviso/dlg-aviso.component';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatSortModule } from '@angular/material';
import {Router} from "@angular/router"
import {SESSION_STORAGE, WebStorageService} from 'angular-webstorage-service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-autores-mod',
  templateUrl: './autores-mod.component.html',
  styleUrls: ['./autores-mod.component.css']
})
export class AutoresModComponent implements OnInit {
  titulo="";
  autor="";
  habilitado=true;
  idActual="";
  @ViewChild('nombre',null) txtNombre: ElementRef;

  constructor(
    public dialog: MatDialog,
    private httpClient: HttpClient,
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: WebStorageService,
  ) { }

  ngOnInit() {
    this.txtNombre.nativeElement.focus();
    if (this.storage.get("idConexion")==null){
      this.router.navigate(['/'])
    }
    if (this.storage.get("idGeneral")=="00000000-0000-0000-0000-000000000000"){
      this.titulo="Agregar nuevo autor";
    }else{
      this.titulo="Modificar autor";
    }
    this.leerDato();
  }

  leerDato(){
    let dlgTrabajando = this.dialog.open(DlgTrabajandoComponent, {
      width: '600px',
      disableClose:true
    });
    dlgTrabajando.componentInstance.titulo="";
    dlgTrabajando.componentInstance.texto="Buscando los datos del autor";

    this.idActual=this.storage.get("idGeneral");
    this.httpClient.get(environment.servidorHttp+'Sistema/leerAutor'
      ,{
        params: {
          "idConexion": this.storage.get("idConexion"),
          "idAutor": this.idActual
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
        dlgError.componentInstance.titulo="Error al buscar el dato del autor";
        dlgError.componentInstance.texto=data['resultado']['msgError']['mensaje'];
      }else if (data['resultado']['msgError']['valorDevuelto']=="10"){
        let dlgError = this.dialog.open(DlgErrorComponent, {
          width: '600px',
          disableClose:true
        });
        dlgError.componentInstance.titulo="Error al almacenar el autor";
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
        dlgError.componentInstance.titulo="Error al buscar el dato del autor";
        dlgError.componentInstance.texto="Su sesión ha finalizado";
        this.router.navigate(['/']);
        delete this.storage;
      }else{
        dlgError.componentInstance.titulo="Error al buscar el dato del autor";
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
    dlgTrabajando.componentInstance.texto="Intentando almacenar el autor";

    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('idConexion', this.storage.get("idConexion"));
    urlSearchParams.append('idAutor', this.idActual);    
    urlSearchParams.append('nombre', this.autor);    
    urlSearchParams.append('habilitado', String(this.habilitado));    

    let parametros = urlSearchParams.toString()
    this.httpClient.post(environment.servidorHttp+'Sistema/modificarAutor?'+parametros, null,
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
            dlgError.componentInstance.titulo="Error al almacenar el autor";
            dlgError.componentInstance.texto=data['resultado']['msgError']['mensaje'];
          }else if (data['resultado']['msgError']['valorDevuelto']=="10"){
            let dlgError = this.dialog.open(DlgErrorComponent, {
              width: '600px',
              disableClose:true
            });
            dlgError.componentInstance.titulo="Error al almacenar el autor";
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
              dlgError.componentInstance.titulo="Error al almacenar el dato del autor";
              dlgError.componentInstance.texto="Su sesión ha finalizado";
              this.router.navigate(['/']);
              delete this.storage;
            }else{
              dlgError.componentInstance.titulo="Error al almacenar el dato del autor";
              dlgError.componentInstance.texto=error.message+" ("+error.status+")";
            } 
        }
      );
  }
}
