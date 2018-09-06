import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.css']
})
export class InfoDialogComponent implements OnInit {

  @Input() state: any;


  constructor() { }

  ngOnInit() {
  }

}
