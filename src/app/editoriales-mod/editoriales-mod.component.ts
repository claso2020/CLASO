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
  selector: 'app-editoriales-mod',
  templateUrl: './editoriales-mod.component.html',
  styleUrls: ['./editoriales-mod.component.css']
})
export class EditorialesModComponent implements OnInit {
  titulo="";
  editorial="";
  habilitada=true;
  idActual="";
  @ViewChild('nombre',null) txtNombre: ElementRef;

  constructor(
    public dialog: MatDialog,
    private httpClient: HttpClient,
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: WebStorageService,
    private location: Location,
  ) { }

  ngOnInit() {
    this.txtNombre.nativeElement.focus();
    if (this.storage.get("idConexion")==null){
      this.router.navigate(['/'])
    }
    if (this.storage.get("idGeneral")=="00000000-0000-0000-0000-000000000000"){
      this.titulo="Agregar nueva editorial";
    }else{
      this.titulo="Modificar editorial";
    }
    this.leerDatoEditorial();
  }

  leerDatoEditorial(){
    let dlgTrabajando = this.dialog.open(DlgTrabajandoComponent, {
      width: '600px',
      disableClose:true
    });
    dlgTrabajando.componentInstance.titulo="";
    dlgTrabajando.componentInstance.texto="Buscando los datos de la editorial";

    this.idActual=this.storage.get("idGeneral");
    this.httpClient.get(environment.servidorHttp+'Sistema/leerEditorial'
      ,{
        params: {
          "idConexion": this.storage.get("idConexion"),
          "idEditorial": this.idActual
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
        dlgError.componentInstance.titulo="Error al buscar el dato de la editorial";
        dlgError.componentInstance.texto=data['resultado']['msgError']['mensaje'];
      }else if (data['resultado']['msgError']['valorDevuelto']=="10"){
        let dlgError = this.dialog.open(DlgErrorComponent, {
          width: '600px',
          disableClose:true
        });
        dlgError.componentInstance.titulo="Error al almacenar la editorial";
        dlgError.componentInstance.texto=data['resultado']['msgError']['mensaje'];
        this.router.navigate(['/']);
        delete this.storage;
      }else{
        if (data['resultado']['msgError']['nombreEditotrial']!=null){
          this.editorial=data['resultado']['msgError']['nombreEditotrial'];
        }
        this.habilitada=data['resultado']['msgError']['habilitada']=="1";
      }
    },
    (error: HttpErrorResponse) => {
      this.cerrarDialogo(dlgTrabajando);
      let dlgError = this.dialog.open(DlgErrorComponent, {
        width: '600px',
        disableClose:true
      });
      if (error.status.toString()=="401"){
        dlgError.componentInstance.titulo="Error al buscar el dato de la editorial";
        dlgError.componentInstance.texto="Su sesión ha finalizado";
        this.router.navigate(['/']);
        delete this.storage;
      }else{
        dlgError.componentInstance.titulo="Error al buscar el dato de la editorial";
        dlgError.componentInstance.texto=error.message+" ("+error.status+")";
      }
    });
  }

  cerrarDialogo(dialogoActual) {
    dialogoActual.close();
  }

  volver() {
    this.router.navigate(['/editoriales']);
  }

  almacenarEditorial(){
    let dlgTrabajando = this.dialog.open(DlgTrabajandoComponent, {
      width: '600px',
      disableClose:true
    });
    dlgTrabajando.componentInstance.titulo="";
    dlgTrabajando.componentInstance.texto="Intentando almacenar la editorial";

    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('idConexion', this.storage.get("idConexion"));
    urlSearchParams.append('idEditorial', this.idActual);    
    urlSearchParams.append('nombre', this.editorial);    
    urlSearchParams.append('habilitada', String(this.habilitada));    

    let parametros = urlSearchParams.toString()
    this.httpClient.post(environment.servidorHttp+'Sistema/modificarEditorial?'+parametros, null,
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
            dlgError.componentInstance.titulo="Error al almacenar la editorial";
            dlgError.componentInstance.texto=data['resultado']['msgError']['mensaje'];
          }else if (data['resultado']['msgError']['valorDevuelto']=="10"){
            let dlgError = this.dialog.open(DlgErrorComponent, {
              width: '600px',
              disableClose:true
            });
            dlgError.componentInstance.titulo="Error al almacenar la editorial";
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
            this.router.navigate(['/editoriales']);
          }
        },
        (error: HttpErrorResponse) => {
            this.cerrarDialogo(dlgTrabajando);
            let dlgError = this.dialog.open(DlgErrorComponent, {
              width: '600px',
              disableClose:true
            });
            if (error.status.toString()=="401"){
              dlgError.componentInstance.titulo="Error al almacenar el dato de la editorial";
              dlgError.componentInstance.texto="Su sesión ha finalizado";
              this.router.navigate(['/']);
              delete this.storage;
            }else{
              dlgError.componentInstance.titulo="Error al almacenar el dato de la editorial";
              dlgError.componentInstance.texto=error.message+" ("+error.status+")";
            } 
        }
      );
  }
}
