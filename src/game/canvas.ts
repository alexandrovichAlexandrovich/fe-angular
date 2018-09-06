import { Map } from './map'
import {visit} from "../../node_modules/@angular/compiler-cli/src/ngtsc/util/src/visitor";

export class MultiCanvas {

  side = 50;
  h = 250;
  w = 500;

  mouse: HTMLCanvasElement;
  cursor: HTMLCanvasElement;
  indicators: HTMLCanvasElement;
  background: HTMLCanvasElement;

  map: Map = new Map();

  constructor(mouse: any, cursor: any, indicators: any, background: any) {
    this.mouse = mouse;
    this.cursor = cursor;
    this.indicators = indicators;
    this.background = background;
  }



  getMousePosAndDrawCursor(ev: MouseEvent) {
    const pt = this.getMousePos(ev);
    const ctx = this.cursor.getContext('2d');
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.fillStyle = 'rgba(0,0,0,.25)';
    ctx.fillRect(pt.x * 50, pt.y * 50, 50, 50)
  }

  getMousePos(ev: MouseEvent) {
    const rect = this.mouse.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    return {
      x: (x - x % this.side) / this.side,
      y: (y - y % this.side) / this.side
    };
  }

  drawGrid() {
    const ctx = this.background.getContext('2d');
    for(let i = 0; i < 10; i++) {
      for(let j = 0; j < 5; j++) {
        ctx.fillStyle = (i + j) % 2 === 0 ? '#ffffff' : '#aaaaaa'
        ctx.fillRect(i * 50, j * 50, 50, 50);
      }
    }
  }

  eraseIndicators() {
    const ctx = this.indicators.getContext('2d');
    ctx.clearRect(0,0,500,500);
  }

  drawMovementRange(u: any) {
    // console.log('unit clicked in map');
    // console.log(u);
    // console.log(JSON.parse(JSON.stringify(this.map.penalty)));
    // this.dfsMovement(u.mvt, u.position.x, u.position.y);
    const map = this.computePathBFS(u.position, u.mvt);
    // console.log(map);
    for (let x = 0; x < map.length; x++) {
      for (let y = 0; y < map[0].length; y++) {
        if (map[x][y]) {
          this.color(x,y,'blue');
        }
      }
    }
  }

  private dfsMovement(mov, x, y){
    if (x < 0 || x >= this.map.width || y < 0 || y >= this.map.height){ return; }
    mov -= this.map.penalty[x][y];
    if ( mov < 0 ) return;
    this.color(x,y,'rgba(0,0,255,.5');
    this.dfsMovement(mov-1, x-1, y);
    this.dfsMovement(mov-1, x+1, y);
    this.dfsMovement(mov-1, x, y-1);
    this.dfsMovement(mov-1, x, y+1);
  }

  private color(x, y, color) {
    const ctx = this.indicators.getContext('2d');
    ctx.clearRect(x * this.side, y * this.side, this.side, this.side);
    ctx.fillStyle = color;
    let grd = ctx.createRadialGradient(x*50 + 25, y*50+25, 7, x*50 + 26, y*50+26, 50);
    grd.addColorStop(0,'rgba(100,100,255,0.5)');
    grd.addColorStop(1,'rgba(0,0,255,0.8)');
    ctx.fillStyle = grd;
    ctx.fillRect(x * this.side + 1, y * this.side + 1, this.side - 1, this.side - 1);

  }

  canMove(u, target){
    return this.dfs(u.mvt, u.position.x, u.position.y, target);
  }

  private dfs(mov, x,y, target): boolean {
    // console.log('dfs to '+x+', '+y+' with remaining movement '+mov);
    if (x < 0 || x >= this.map.width || y < 0 || y >= this.map.height){ return false; }
    mov -= this.map.penalty[x][y];
    if ( mov < 0 ) return false;
    if (target.x === x && target.y === y) return true;
    this.color(x,y,'rgba(100,100,255,0.5)');
    if (this.dfs(mov-1, x-1, y, target)) return true;
    if (this.dfs(mov-1, x+1, y, target)) return true;
    if (this.dfs(mov-1, x, y-1, target)) return true;
    if (this.dfs(mov-1, x, y+1, target)) return true;
    return false;
  }

  drawPath(unit, end) {
    const path = this.computePathBFS(unit.position, unit.mvt);
    if (!path[end.x][end.y]) return null;
    return path[end.x][end.y].path;
  }

  private computePathBFS(pos, mvt: number) {
    let visited = [];
    for(var _x = 0; _x < this.map.width; _x++){
      visited.push([]);
      for(var _y = 0; _y < this.map.height; _y++){
        visited[_x].push(false);
      }
    }
    visited[pos.x][pos.y] = {path: '', mvt: mvt};
    let q = [{x: pos.x, y: pos.y}];
    while (q.length > 0) {
      let curr = q.shift();
      let x = curr.x;
      let y = curr.y;
      // console.log('curr: '+curr.x+','+curr.y);
      let penalty; let p; let m;
      let neighbors = [
        {x: x-1, y: y, code: 'l'},
        {x: x+1, y: y, code: 'r'},
        {x: x, y: y+1, code: 'd'},
        {x: x, y: y-1, code: 'u'},
      ];
      for (let n of neighbors) {
        if(this.validCoords(n.x, n.y)) {
          // console.log(this.map.penalty[n.x][n.y]);
          penalty = this.map.penalty[n.x][n.y] + 1;
          m = visited[x][y].mvt - penalty;
          if(!visited[n.x][n.y] || visited[n.x][y].mvt < m){
            if (m >= 0) {
              p = visited[x][y].path;
              visited[n.x][n.y] = {path: p + n.code, mvt: m};
              q.push({x:n.x, y:n.y});
            }
          }
        }
      }
    }
    return visited;
  }

  private validCoords(x, y) {
    if(x < 0 || x >= this.map.width || y < 0 || y >= this.map.height){ return false; }
    return true;
  }
}
