import { Map } from './map';
import * as Dex from '../dex/tile-dex';

export class MultiCanvas {

  mouse: HTMLCanvasElement;
  cursor: HTMLCanvasElement;
  indicators: HTMLCanvasElement;
  background: HTMLCanvasElement;
  paths: HTMLCanvasElement;

  map: Map = new Map();
  side = 30;
  h = this.map.height * this.side;
  w = this.map.width * this.side;

  constructor(mouse: any, cursor: any, indicators: any, background: any, paths: any) {
    this.mouse = mouse;
    this.cursor = cursor;
    this.indicators = indicators;
    this.background = background;
    this.paths = paths;
    // console.log(Dex.TileDex);
  }

  getMousePosAndDrawCursor(ev: MouseEvent) {
    const pt = this.getMousePos(ev);
    const ctx = this.cursor.getContext('2d');
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.fillStyle = 'rgba(0,0,0,.25)';
    ctx.fillRect(pt.x * this.side, pt.y * this.side, this.side, this.side);
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
        ctx.fillStyle = (i + j) % 2 === 0 ? '#ffffff' : '#aaaaaa';
        ctx.fillRect(i * this.side, j * this.side, this.side, this.side);
      }
    }
  }

  eraseIndicators() {
    const ctx = this.indicators.getContext('2d');
    ctx.clearRect(0,0,this.w,this.h);
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
    mov -= Dex.TileDex[this.map.tiles[x][y]].penalty;
    if ( mov < 0 ) { return; }
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
    const grd = ctx.createRadialGradient(x*this.side + (this.side/2), y*this.side + (this.side/2), 6, x*this.side + this.side/2, y*this.side + this.side/2, this.side-2);
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
    mov -= Dex.TileDex[this.map.tiles[x][y]].penalty;
    if ( mov < 0 ) { return false; }
    if (target.x === x && target.y === y) { return true; }
    this.color(x,y,'rgba(100,100,255,0.5)');
    if (this.dfs(mov, x-1, y, target)) { return true; }
    if (this.dfs(mov, x+1, y, target)) { return true; }
    if (this.dfs(mov, x, y-1, target)) { return true; }
    if (this.dfs(mov, x, y+1, target)) { return true; }
    return false;
  }

  drawPath(unit, end) {
    const path = this.computePathBFS(unit.position, unit.mvt);
    if (!path[end.x][end.y]) { return null; }
    return path[end.x][end.y].path;
  }

  private computePathBFS(pos, mvt: number) {
    const visited = [];
    for(let _x = 0; _x < this.map.width; _x++){
      visited.push([]);
      for(let _y = 0; _y < this.map.height; _y++){
        visited[_x].push(false);
      }
    }
    visited[pos.x][pos.y] = {path: '', mvt: mvt};
    const q = [{x: pos.x, y: pos.y}];
    while (q.length > 0) {
      const curr = q.shift();
      const x = curr.x;
      const y = curr.y;
      // console.log('curr: '+curr.x+','+curr.y);
      let penalty; let p; let m;
      const neighbors = [
        {x: x-1, y: y, code: 'l'},
        {x: x+1, y: y, code: 'r'},
        {x: x, y: y+1, code: 'd'},
        {x: x, y: y-1, code: 'u'},
      ];
      for (const n of neighbors) {
        if(this.validCoords(n.x, n.y)) {
          // console.log(this.map.penalty[n.x][n.y]);
          // console.log(n.x+' '+n.y+'; '+this.map.tiles[n.x][n.y]+';'+Dex.TileDex[this.map.tiles[n.x][n.y]]);
          penalty = Dex.TileDex[this.map.tiles[n.x][n.y]].penalty;
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

  public drawPathMarkers(pos, path: string) {
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
      this.drawPathCircle(pos);
      // console.log(pos);
    }
  }

  private drawPathCircle(pos){
    const ctx = this.paths.getContext('2d');
    ctx.fillStyle='lightblue';
    ctx.beginPath();
    ctx.arc((pos.x+.5)*this.side, (pos.y+.5)*this.side, this.side/6, 0, 2*Math.PI);
    ctx.fill();
  }

  public clearPathMarkers(){
    const ctx = this.paths.getContext('2d');
    ctx.clearRect(0,0,this.w,this.h);
  }
}
