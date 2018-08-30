import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-unit-sprites',
  templateUrl: './unit-sprites.component.html',
  styleUrls: ['./unit-sprites.component.css']
})
export class UnitSpritesComponent implements OnInit {

  @Input() units: any;
  @Input() enemies: any;

  constructor() { }

  ngOnInit() {
  }

}
