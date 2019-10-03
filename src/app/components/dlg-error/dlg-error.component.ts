import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-dlg-error',
  templateUrl: './dlg-error.component.html',
  styleUrls: ['./dlg-error.component.css']
})
export class DlgErrorComponent implements OnInit {

  constructor(public thisDialogRef: MatDialogRef<DlgErrorComponent>, 
    @Inject(MAT_DIALOG_DATA) public titulo: string,
    @Inject(MAT_DIALOG_DATA) public texto: string
    ) 
    { 

    }

  ngOnInit() {
  }

  cerrar() {
    this.thisDialogRef.close('nose');
  }
}
