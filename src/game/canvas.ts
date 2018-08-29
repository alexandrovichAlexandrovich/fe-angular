export class MultiCanvas{

  side = 50;
  h = 500;
  w = 500;

  mouse: HTMLCanvasElement;
  cursor: HTMLCanvasElement;
  indicators: HTMLCanvasElement;
  background: HTMLCanvasElement;

  constructor(mouse: any, cursor: any, indicators: any, background: any) {
    this.mouse = mouse;
    this.cursor = cursor;
    this.indicators = indicators;
    this.background = background;
  }


  getMousePosAndDrawCursor(ev: MouseEvent) {
    console.log('yeet');
    let pt = this.getMousePos(ev);
    const ctx = this.cursor.getContext('2d');
    ctx.clearRect(0,0,this.w,this.h);
    ctx.fillStyle = 'rgba(0,0,0,.25)';
    ctx.fillRect(pt.x*50, pt.y*50, 50, 50)
  }

  getMousePos(ev: MouseEvent) {
    const rect = this.mouse.getBoundingClientRect();
    let x = ev.clientX - rect.left;
    let y = ev.clientY - rect.top;
    return {
      x: (x-x%this.side)/this.side,
      y: (y-y%this.side)/this.side
    };
  }

  drawGrid(){
    const ctx = this.background.getContext('2d');
    for(let i = 0; i < 10; i++){
      for(let j = 0; j < 10; j++){
        ctx.fillStyle = (i + j) % 2 == 0 ? '#ffffff' : '#aaaaaa'
        ctx.fillRect(i*50, j*50, 50, 50);
      }
    }
  }
}
