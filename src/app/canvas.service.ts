import { Injectable } from '@angular/core';
import {MapService} from './map.service';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  mouse: HTMLCanvasElement;
  cursor: HTMLCanvasElement;
  indicators: HTMLCanvasElement;
  background: HTMLCanvasElement;
  paths: HTMLCanvasElement;

  mousePosition = {
    x: 0,
    y: 0
  };

  mouseTile = {
    x: 0,
    y: 0
  }

  size: number;

  constructor(public map: MapService) {}

  public setHtmlElements(m, c, i, b, p) {
    this.mouse = m;
    this.cursor = c;
    this.indicators = i;
    this.background = b;
    this.paths = p;
  }

  eraseIndicators() {
    this.clearPathMarkers();
    const ctx = this.indicators.getContext('2d');
    ctx.clearRect(0,0, this.map.width * this.size, this.map.height * this.size);
  }

  setSize(size) {
    this.size = size;
  }

  setMousePosition(ev: MouseEvent) {
    const rect = this.mouse.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    this.mousePosition = {
      x: x /*- x % this.size) *//* / this.size */,
      y: y /* - y % this.size) *//* / this.size */
    };

    this.mouseTile = {
      x: (x - x % this.size) / this.size,
      y: (y - y % this.size) / this.size
    };
  }

  drawMovementRange(unit) {
    this.eraseIndicators();
    const chart = this.getMovementChart(unit);
    for(let x = 0; x < chart.length; x++) {
      for(let y = 0; y < chart[0].length; y++) {
        if (chart[x][y] === 'x') {
          this.drawIndicator(x, y, 255, 0, 0);
        } else if (chart[x][y]) {
          this.drawIndicator(x, y, 0, 0, 255);
        }
      }
    }
  }

  private drawIndicator(x, y, r0, g0, b0) {
    const ctx = this.indicators.getContext('2d');
    ctx.clearRect(x * this.size, y * this.size, this.size, this.size);
    const grd = ctx.createRadialGradient(
                      x*this.size + (this.size/2),
                      y*this.size + (this.size/2),
                      6,
                      x*this.size + this.size/2,
                      y*this.size + this.size/2,
                      this.size-2
    );

    const r1 = Math.min(255, r0 + 100);
    const g1 = Math.min(255, g0 + 100);
    const b1 = Math.min(255, b0 + 100);

    grd.addColorStop(0, 'rgba('+r1+','+g1+','+b1+', 0.5)');
    grd.addColorStop(1, 'rgba('+r0+','+g0+','+b0+', 0.8)');

    ctx.fillStyle = grd;
    ctx.fillRect(x * this.size + 1, y * this.size + 1,
                 this.size - 1, this.size - 1);
  }

  /**
   * Returns the possible locations on the map to which a unit can move and attack.
   * Pretty simple BFS implementation.
   *
   * @param map
   * @param pos
   * @param moves
   */

  getMovementChart(unit) {
    const chart = [];
    const pos = unit.position;
    const range = [10, 0];
    for (const item of unit.inventory) {
      if (item.target = 'enemy') {
        range[0] = Math.min(range[0], item.range[0]);
        range[1] = Math.max(range[1], item.range[1]);
      }
    }
    console.log(range);
    for (let x = 0; x < this.map.width; x++) {
      chart.push([]);
      for (let y = 0; y < this.map.width; y++) {
        chart[x].push(false);
      }
    }

    chart[pos.x][pos.y] = {path: '', mvt: unit.mvt};
    const q = [{x: pos.x, y: pos.y}];

    while (q.length > 0) {
      const curr = q.shift();

      let penalty, path, remaining;

      for (let i = range[0]; i <= range[1]; i++) {
        for (let attack of this.getAttacksInRange(curr.x, curr.y, range)) {
          // console.log('atk'+JSON.stringify(attack));
          if(this.map.validCoords(attack.x, attack.y) && !chart[attack.x][attack.y]) {
            chart[attack.x][attack.y] = 'x';
          }
        }
      }

      const neighbors = [
        {x: curr.x-1, y: curr.y, code: 'l'},
        {x: curr.x+1, y: curr.y, code: 'r'},
        {x: curr.x, y: curr.y+1, code: 'd'},
        {x: curr.x, y: curr.y-1, code: 'u'},
      ];

      for (const n of neighbors) {
        if (this.map.validCoords(n.x, n.y)) {
          penalty = this.map.getPenalty(unit, n.x, n.y);
          remaining = chart[curr.x][curr.y].mvt - penalty;
          const overwritePath = !chart[n.x][n.y] || chart[n.x][n.y] === 'x' || chart[n.x][n.y].mvt < remaining;
          if(remaining >= 0 && overwritePath) {
            path = chart[curr.x][curr.y].path + n.code;
            chart[n.x][n.y] = {path: path, mvt: remaining};
            q.push({x:n.x, y:n.y});
          }
        }
      }
    }
    return chart;
  }

  drawPathMarkers(unit) {
    this.clearPathMarkers();
    const path = this.getMovementChart(unit)[this.mouseTile.x][this.mouseTile.y].path;
    let pos = {
      x: unit.position.x,
      y: unit.position.y
    };
    if (path) {
      for (const c of path){
        switch(c) {
          case 'l':
            pos = {x: pos.x-1, y: pos.y};
            break;
          case 'r':
            pos = {x: pos.x+1, y: pos.y};
            break;
          case 'u':
            pos = {x: pos.x, y: pos.y-1};
            break;
          case 'd':
            pos = {x: pos.x, y: pos.y+1};
            break;
        }
        this.drawLilCircle(pos);
      }
    }
  }

  private drawLilCircle(pos) {
    const ctx = this.paths.getContext('2d');
    ctx.fillStyle='lightblue';
    ctx.beginPath();
    ctx.arc((pos.x+.5)*this.size, (pos.y+.5)*this.size,
      this.size/6, 0, 2*Math.PI);
    ctx.fill();
  }

  private clearPathMarkers(){
    const ctx = this.paths.getContext('2d');
    ctx.clearRect(0,0, this.map.width * this.size, this.map.height * this.size);
  }

  private getAttacksInRange(x: any, y: any, range: number[]) {
    const attacks = [];
    for (let i = range[0]; i <= range[1]; i++) {
      for (let k = 0; k < i; k++) {
        attacks.push({x: x+k, y: y+i-k});
        attacks.push({x: x+i-k, y: y-k});
        attacks.push({x: x-k, y: y-i+k});
        attacks.push({x: x-i+k, y: y+k})
      }
        // attacks.push({x: x+i, y: y+i});
        // attacks.push({x: x-i, y: y+i});
        // attacks.push({x: x+i, y: y-i});
        // attacks.push({x: x-i, y: y-i});
    }
    // console.log(attacks);
    return attacks;
  }
}
