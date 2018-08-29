export class CanvasUtil {
  static getMousePos(canv: HTMLCanvasElement, ev: MouseEvent) {
    const rect = canv.getBoundingClientRect();
    let x = ev.clientX - rect.left;
    let y = ev.clientY - rect.top;
    return {
      x: (x-x%50)/50,
      y: (y-y%50)/50
    };
  }

  static drawCursor(canv: HTMLCanvasElement, pt: {x: number, y: number}){
    const ctx = canv.getContext('2d');
    ctx.clearRect(0,0,500,500);
    ctx.fillStyle = 'rgba(0,0,0,.25)';
    ctx.fillRect(pt.x * 50, pt.y * 50, 50, 50);
  }

  static drawGrid(canv: HTMLCanvasElement){
    const ctx = canv.getContext('2d');
    for(let i = 0; i < 10; i++){
      for(let j = 0; j < 10; j++){
        ctx.fillStyle = (i + j) % 2 == 0 ? '#ffffff' : '#aaaaaa'
        ctx.fillRect(i*50, j*50, 50, 50);
      }
    }
  }
}
