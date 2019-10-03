import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-dlg-aviso',
  templateUrl: './dlg-aviso.component.html',
  styleUrls: ['./dlg-aviso.component.css']
})
export class DlgAvisoComponent implements OnInit {

  constructor(
    public thisDialogRef: MatDialogRef<DlgAvisoComponent>, 
    @Inject(MAT_DIALOG_DATA) public titulo: string,
    @Inject(MAT_DIALOG_DATA) public texto: string
  ) { }

  ngOnInit() {
  }

  cerrar() {
    this.thisDialogRef.close('nose');
  }
}
