import { Component, OnInit } from '@angular/core';
import { slideInAnimation } from '../route-animation';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css'],
  animations: [slideInAnimation]
})
export class AppLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log("layout");
  }

}
