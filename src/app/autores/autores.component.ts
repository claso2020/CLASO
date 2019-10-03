import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { DlgTrabajandoComponent } from '../components/dlg-trabajando/dlg-trabajando.component';
import { DlgErrorComponent } from '../components/dlg-error/dlg-error.component';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { MatDialog} from '@angular/material';
import {Router} from "@angular/router"
import {SESSION_STORAGE, WebStorageService} from 'angular-webstorage-service';
import {Location} from '@angular/common';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material'
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-autores',
  templateUrl: './autores.component.html',
  styleUrls: ['./autores.component.css']
})
export class AutoresComponent implements OnInit {

  displayedColumns: string[] = ['acciones','nombre','habilitado'];
  dataSource = new MatTableDataSource();
  escondeTabla: boolean = true;
  
  @ViewChild(MatPaginator, {static: true}) paginador: MatPaginator;
  @ViewChild(MatSort, {static: true}) ordenar: MatSort;
  @ViewChild('Tabla',null) tablaLocal: ElementRef;

  constructor(
    public dialog: MatDialog,
    private httpClient: HttpClient,
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: WebStorageService,
    private location: Location
  ) { }

  ngOnInit() {
    if (this.storage.get("idConexion")==null){
      this.router.navigate(['/'])
    }
    this.buscarDatos();
  }

  volver() {
    this.router.navigate(['/parametros']);
    //this.location.back();
  }

  buscarDatos(){
    let dlgTrabajando = this.dialog.open(DlgTrabajandoComponent, {
      width: '600px',
      disableClose:true
    });
    dlgTrabajando.componentInstance.titulo="";
    dlgTrabajando.componentInstance.texto="Buscando los autores";

    this.httpClient.get(environment.servidorHttp+'Sistema/leerAutores'
      ,{
        params: {
          "idConexion": this.storage.get("idConexion")
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
        dlgError.componentInstance.titulo="Error al buscar los autores";
        dlgError.componentInstance.texto=data['resultado']['msgError']['mensaje'];
      }else{
        if (data['resultado']['datos']==undefined){
          this.escondeTabla=true;
          return;
        }
        this.escondeTabla=false;
        this.dataSource = new MatTableDataSource<any>(data['resultado']['datos']);
        this.dataSource.sort = this.ordenar;
        this.dataSource.paginator = this.paginador;
        this.paginador._intl.itemsPerPageLabel = 'Autores por hoja';
        this.paginador._intl.nextPageLabel  = 'Proxima hoja';
        this.paginador._intl.previousPageLabel  = 'Hoja anterior';
        this.paginador._intl.lastPageLabel  = 'Última hoja';
        this.paginador._intl.firstPageLabel  = 'Primera hoja';
        this.paginador._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
          return 'De '+((page * pageSize) + 1) + ' a ' + ((page * pageSize) + pageSize) + ' de ' + length; 
        }
        this.dataSource.filterPredicate = function(data, filter: string): boolean {
          //@ts-ignore
          return data.nombre.toLowerCase().includes(filter.toLowerCase()) //no importa que de error en "nombre", es porque es un datasource no tipado
            // || data.habilitada.toLowerCase()=== filter.toLowerCase(); //para continuar con los otros campos
        };
      }
    },
    (error: HttpErrorResponse) => {
      this.cerrarDialogo(dlgTrabajando);
      let dlgError = this.dialog.open(DlgErrorComponent, {
        width: '600px',
        disableClose:true
      });
      if (error.status.toString()=="401"){
        dlgError.componentInstance.titulo="Error al buscar los autores";
        dlgError.componentInstance.texto="Su sesión ha finalizado";
        this.router.navigate(['/']);
        delete this.storage;
      }else{
        dlgError.componentInstance.titulo="Error al buscar los autores";
        dlgError.componentInstance.texto=error.message+" ("+error.status+")";
      }
    });
  }

  cerrarDialogo(dialogoActual) {
    dialogoActual.close();
  }

  modificar(idGeneral) {
    this.storage.set("idGeneral",idGeneral);
    this.router.navigate(['/autores-mod'])
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportarAExcel()
    {
      this.paginador._changePageSize(2000);
      let dlgTrabajando = this.dialog.open(DlgTrabajandoComponent, {
        width: '600px',
        disableClose:true
      });
      dlgTrabajando.componentInstance.titulo="";
      dlgTrabajando.componentInstance.texto="Descargando el archivo";
      var myTimer = setInterval(() => {
        const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.tablaLocal.nativeElement);//converts a DOM TABLE element to a worksheet
        this.delete_cols(ws,0,0);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');
  
        /* save to file */
        XLSX.writeFile(wb, 'autores.xlsx');
        this.paginador._changePageSize(5);
        clearInterval(myTimer);
        this.cerrarDialogo(dlgTrabajando);
      }, 300);
      
  }

  delete_cols(ws, start_col, ncols) {
    if(!ws) throw new Error("operation expects a worksheet");
    var dense = Array.isArray(ws);
    if(!ncols) ncols = 1;
    if(!start_col) start_col = 0;
  
    /* extract original range */
    var range = XLSX.utils.decode_range(ws["!ref"]);
    var R = 0, C = 0;
  
    var formula_cb = function($0, $1, $2, $3, $4, $5) {
      var _R = XLSX.utils.decode_row($5), _C = XLSX.utils.decode_col($3);
      if(_C >= start_col) {
        _C -= ncols;
        if(_C < start_col) return "#REF!";
      }
      return $1+($2=="$" ? $2+$3 : XLSX.utils.encode_col(_C))+($4=="$" ? $4+$5 : XLSX.utils.encode_row(_R));
    };
  
    var addr, naddr;
    for(C = start_col + ncols; C <= range.e.c; ++C) {
      for(R = range.s.r; R <= range.e.r; ++R) {
        addr = XLSX.utils.encode_cell({r:R, c:C});
        naddr = XLSX.utils.encode_cell({r:R, c:C - ncols});
        if(!ws[addr]) { delete ws[naddr]; continue; }
        if(ws[addr].f) ws[addr].f = ws[addr].f.replace(this.crefregex, formula_cb);
        ws[naddr] = ws[addr];
      }
    }
    for(C = range.e.c; C > range.e.c - ncols; --C) {
      for(R = range.s.r; R <= range.e.r; ++R) {
        addr = XLSX.utils.encode_cell({r:R, c:C});
        delete ws[addr];
      }
    }
    for(C = 0; C < start_col; ++C) {
      for(R = range.s.r; R <= range.e.r; ++R) {
        addr = XLSX.utils.encode_cell({r:R, c:C});
        if(ws[addr] && ws[addr].f) ws[addr].f = ws[addr].f.replace(this.crefregex, formula_cb);
      }
    }
  
    /* write new range */
    range.e.c -= ncols;
    if(range.e.c < range.s.c) range.e.c = range.s.c;
    ws["!ref"] = XLSX.utils.encode_range(this.clamp_range(range));
  
    /* merge cells */
    if(ws["!merges"]) ws["!merges"].forEach(function(merge, idx) {
      var mergerange;
      switch(typeof merge) {
        case 'string': mergerange = XLSX.utils.decode_range(merge); break;
        case 'object': mergerange = merge; break;
        default: throw new Error("Unexpected merge ref " + merge);
      }
      if(mergerange.s.c >= start_col) {
        mergerange.s.c = Math.max(mergerange.s.c - ncols, start_col);
        if(mergerange.e.c < start_col + ncols) { delete ws["!merges"][idx]; return; }
        mergerange.e.c -= ncols;
        if(mergerange.e.c < mergerange.s.c) { delete ws["!merges"][idx]; return; }
      } else if(mergerange.e.c >= start_col) mergerange.e.c = Math.max(mergerange.e.c - ncols, start_col);
      this.clamp_range(mergerange);
      ws["!merges"][idx] = mergerange;
    });
    if(ws["!merges"]) ws["!merges"] = ws["!merges"].filter(function(x) { return !!x; });
  
    /* cols */
    if(ws["!cols"]) ws["!cols"].splice(start_col, ncols);
  }

  clamp_range(range) {
    if(range.e.r >= (1<<20)) range.e.r = (1<<20)-1;
    if(range.e.c >= (1<<14)) range.e.c = (1<<14)-1;
    return range;
  }
  
  crefregex = /(^|[^._A-Z0-9])([$]?)([A-Z]{1,2}|[A-W][A-Z]{2}|X[A-E][A-Z]|XF[A-D])([$]?)([1-9]\d{0,5}|10[0-3]\d{4}|104[0-7]\d{3}|1048[0-4]\d{2}|10485[0-6]\d|104857[0-6])(?![_.\(A-Za-z0-9])/g;
}