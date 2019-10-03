import { Component, OnInit, Inject } from '@angular/core';
import {Router} from "@angular/router"
import {SESSION_STORAGE, WebStorageService} from 'angular-webstorage-service';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css']
})
export class ParametrosComponent implements OnInit {

  constructor(
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: WebStorageService
  ) { }

  ngOnInit() {
    if (this.storage.get("idConexion")==null){
      this.router.navigate(['/'])
    }
  }

  clickAutores(){
    this.router.navigate(['/autores'])
  }

  clickEditoriales(){
    this.router.navigate(['/editoriales'])
  }

  clickLibros(){
    this.router.navigate(['/libros'])
  }
  
}
