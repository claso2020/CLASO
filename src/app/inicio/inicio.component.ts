import { Component, OnInit , Inject} from '@angular/core';
import {Router} from "@angular/router"
import {SESSION_STORAGE, WebStorageService} from 'angular-webstorage-service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor(
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: WebStorageService
  ) { }

  ngOnInit() {
    if (this.storage.get("idConexion")==null){
      this.router.navigate(['/'])
    }
  }

}
