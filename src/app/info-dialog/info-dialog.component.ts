import {Component, Input, OnInit} from '@angular/core';
import {Machine} from "../../game/game-interface";
import {AssetDex} from "../../dex/asset-dex";
import {ItemDex} from "../../dex/item-dex";

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.css']
})
export class InfoDialogComponent implements OnInit {

  @Input() machine: Machine;

  assets = AssetDex;
  items = ItemDex;

  constructor() {}

  ngOnInit() {
  }

  stringify(obj) {
    return JSON.stringify(obj);
  }

}
