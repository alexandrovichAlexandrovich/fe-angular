import { Injectable } from '@angular/core';
import * as Dex from '../dex/tile-dex';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  loaded = false;
  width: number;
  height: number;
  file: string;
  tiles: number[][];
  
  loadMap(){
    this.width = 24;
    this.height = 16;
    this.file = 'bigmap.png';
    this.tiles =
      [
        [1,1, ,  , , , , , , , , , , , , ],
        [1, , ,1, , ,2, , ,1,1,1,1,1, ,2],
        [1,1,1,1, , , , , , , , , , , , ],
        [ , ,1, , , , , , , , , , ,2,1, ],
        [ , ,1, , , , , ,2, , ,1, , , ,1],
        [ , ,1, , , ,1,1, , , ,1, , , , ],
        [ , , , ,2, , , , , , ,1, , , , ],
        [ , , , , ,2, , , ,1, ,1, , , , ],
        [ , , , , ,1, , , , ,1, ,1,1, , ],
        [ ,2, , , , ,1, , , ,2, ,1, , , ],
        [ , , , , , , , , , , , ,1,1, , ],
        [ ,1,1, , , , , , , , ,1,1, , , ],
        [2,1,1, , , , ,1,1, , ,1, ,2, , ],
        [ ,1,1, ,1,1, ,1,1, , ,1, , ,2, ],
        [ , , , ,1, , ,1,1, , ,1,1,1,1,1],
        [ ,2, , ,1,1, ,1,1, , , , , , , ],
        [ , , ,1,1,1,1,1,1, , , , , , , ],
        [ , , ,1,1, , , , , , , , , , ,1],
        [ , , ,1,1, , , , , , , , ,1, ,1],
        [ , , ,1,1, , ,1,1,1,1,1, , , ,1],
        [1, , , , , , , , , ,1,1, ,1, ,1],
        [1, , , , , , , ,2, ,1,1, , , ,1],
        [1, , , , , , , , , ,1,1,1,1,1,1],
        [1, , , , , ,2, , , , , , , , , ],
      ];
    this.loaded = true;
  }

  validCoords = (x, y) => {
    return x >= 0 && y >= 0 && x < this.width  && y < this.height;
  }

  getPenalty = (unit, x, y) => {
    let tile = this.tiles[x][y];
    if (!tile) {
      tile = 0;
    }
    return Dex.TileDex[tile].penalty;
  }
}
