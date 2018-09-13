import { Injectable } from '@angular/core';
import {GameLoopService} from './gameloop.service';

@Injectable({
  providedIn: 'root'
})
export class SpritesService {

  constructor() { }

  size: number;
  // units: {
  //   names: string[],
  //   units: {}
  // };
  units;

  cursor = false;
  realPos: {};

  public setSize(size) {
    this.size = size;
    // console.log('setting size. this object:');
    console.log(this.size);
  }

  public setUnits(units) {
    this.units = units;
    this.realPos = {};
    console.log('setting units. units:');
    console.log(this.units);
    this.resetRealizedPositions();
  }

  private resetRealizedPositions() {
    for (const name of this.units.names) {
      // console.log(name);
      // console.log(this.units[name]);
      // console.log(this.units[name].position);
      // console.log(this.size);
      this.realPos[name] = {
        x: this.units[name].position.x * this.size,
        y: this.units[name].position.y * this.size
      };
    }
  }

  hideCursor() { this.cursor = false; }
  showCursor() { this.cursor = true; }

  animateMovement(ev: {unit, path, target}) {
    return new Promise((resolve) => {
      this.animatePath(ev.unit, ev.path)
        .then(resolve);
    });
  }

  private animatePath(unit, path){
    return new Promise((resolve) => {
      if (path === ''){
        resolve();
      } else {
        unit.status = path[0];
        this.moveUnitOneTile(unit, path[0], this.size, 2)
          .then(() => {
              this.animatePath(unit, path.slice(1))
                .then(resolve);
            }
          );
      }
    });
  }

  private moveUnitOneTile(unit, direction, pixelsLeft, moveAmount){
    // console.log('shifting');
    return new Promise((resolve) => {
      if (pixelsLeft <= 0) {
        this.shiftRealPos(unit, direction, pixelsLeft);
        resolve();
      } else {
        this.shiftRealPos(unit, direction, moveAmount);
        setTimeout(() => {
          // console.log(direction);
          this.moveUnitOneTile(unit, direction, pixelsLeft-2, moveAmount)
            .then(resolve);
        }, 7);
      }
    });
  }

  private shiftRealPos(unit, direction, amount) {
    switch(direction) {
      case 'l':
        this.realPos[unit.name].x -= amount;
        break;
      case 'r':
        this.realPos[unit.name].x += amount;
        break;
      case 'u':
        this.realPos[unit.name].y -= amount;
        break;
      case 'd':
        this.realPos[unit.name].y += amount;
        break;
    }
  }
}
