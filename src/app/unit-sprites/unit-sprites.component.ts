import {Component, Input, OnInit} from '@angular/core';
import { AssetDex } from '../../dex/asset-dex';
import {SpritesService} from '../sprites.service';

@Component({
  selector: 'app-unit-sprites',
  templateUrl: './unit-sprites.component.html',
  styleUrls: ['./unit-sprites.component.css']
})
export class UnitSpritesComponent implements OnInit {

  // @Input() units: any;
  // @Input() enemies: any;
  // @Input() size: number;

  dex = AssetDex;

  size = 30;

  constructor(public sprites: SpritesService) { }

  ngOnInit() {
  }

}
