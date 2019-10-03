import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-dlg-trabajando',
  templateUrl: './dlg-trabajando.component.html',
  styleUrls: ['./dlg-trabajando.component.css']
})
export class DlgTrabajandoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DlgTrabajandoComponent>,
    @Inject(MAT_DIALOG_DATA) public titulo: string,
    @Inject(MAT_DIALOG_DATA) public texto: string 
  ) { }

  ngOnInit() {
  }

}