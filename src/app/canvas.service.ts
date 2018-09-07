import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  mouse: HTMLCanvasElement;
  cursor: HTMLCanvasElement;
  indicators: HTMLCanvasElement;
  background: HTMLCanvasElement;
  paths: HTMLCanvasElement;

  constructor() { }

  public setHtmlElements(m, c, i, b, p) {
    this.mouse = m;
    this.cursor = c;
    this.indicators = i;
    this.background = b;
    this.paths = p;
  }
}
