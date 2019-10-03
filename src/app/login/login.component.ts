import { Component, OnInit, Inject } from '@angular/core';
import {Router} from "@angular/router"
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {SESSION_STORAGE, WebStorageService} from 'angular-webstorage-service';
import { environment } from '../../environments/environment';
import { DlgTrabajandoComponent } from '../components/dlg-trabajando/dlg-trabajando.component';
import { DlgErrorComponent } from '../components/dlg-error/dlg-error.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private httpClient: HttpClient,
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: WebStorageService
  ) { }

  cerrarDialogo(dialogoActual) {
    dialogoActual.close();
  }

  ingresar(usuario, contrasenia){
    let dlgTrabajando = this.dialog.open(DlgTrabajandoComponent, {
      width: '600px',
      disableClose:true
    });
    dlgTrabajando.componentInstance.titulo="";
    dlgTrabajando.componentInstance.texto="Verificando usuario";

    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('usuario', usuario);
    urlSearchParams.append('password', contrasenia);    

    let parametros = urlSearchParams.toString()
    this.httpClient.post(environment.servidorHttp+'login/Authenticate?'+parametros, null)
      .subscribe(data => {
          if (data['error']=="01"){
            let dlgError = this.dialog.open(DlgErrorComponent, {
              width: '600px',
              disableClose:true
            });
            dlgError.componentInstance.titulo="Error al verificar el usuario";
            dlgError.componentInstance.texto=data['msg_error'];
          }else{
            this.storage.set("token", data['token']);            
            this.storage.set("idConexion", data['idConexion']);
            this.router.navigate(['/miperfil'])
          }
          this.cerrarDialogo(dlgTrabajando);
        },
        (error: HttpErrorResponse) => {
          this.cerrarDialogo(dlgTrabajando);
          let dlgError = this.dialog.open(DlgErrorComponent, {
            width: '600px',
            disableClose:true
          });
          dlgError.componentInstance.titulo="Error general al verificar el usuario";
          dlgError.componentInstance.texto=error.message+" ("+error.name+")";
        } 
      );
  }
  
  ngOnInit() {
  }

}
