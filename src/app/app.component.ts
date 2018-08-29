import {Component, ElementRef, EventEmitter, HostListener, Output, ViewChild} from '@angular/core';
import { Machine } from '../game/game-interface'
import { GameState } from '../game/game-state'
import { MultiCanvas } from '../game/canvas'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('mouse') mouse: ElementRef;
  @ViewChild('cursor') cursor: ElementRef;
  @ViewChild('indic') indicators: ElementRef;
  @ViewChild('map') background: ElementRef;
  canv: MultiCanvas;
  machine: Machine;
  game: GameState;

  ngAfterViewInit(): void{
    this.canv = new MultiCanvas(this.mouse.nativeElement, this.cursor.nativeElement, this.indicators.nativeElement, this.background.nativeElement);
    this.game = new GameState();
    this.machine = new Machine(this.canv, this.game);
  }

  @Output() canvasControl: EventEmitter<any> = new EventEmitter();

  @HostListener('document:keydown.esc')
  onEsc(){ this.machine.state.esc(); }
  onMouseMove(ev){ this.machine.state.mousemove(ev); }
  onMapClick(ev) { this.machine.state.mapclick(ev); }
}
