import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpritesService {

  constructor() { }

  size = 1;
  units = {};

  public set(units, size) {
    this.units = units;
    this.size = size;
  }

  public updatePosition(name, position, size) {
    this.units[name].position = {
      x: position.x * size,
      y: position.y * size
    };
  }
}
