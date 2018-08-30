import {Component, Input, OnInit} from '@angular/core';
import { AssetDex } from "../../dex/asset-dex";

@Component({
  selector: 'app-unit-sprites',
  templateUrl: './unit-sprites.component.html',
  styleUrls: ['./unit-sprites.component.css']
})
export class UnitSpritesComponent implements OnInit {

  @Input() units: any;
  @Input() enemies: any;

  dex = AssetDex;

  constructor() { }

  ngOnInit() {
  }

}
