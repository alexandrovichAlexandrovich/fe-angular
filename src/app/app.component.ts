import {Component, ElementRef, EventEmitter, HostListener, Output, ViewChild} from '@angular/core';
import { Machine } from '../game/game-interface';
import { GameState } from '../game/game-state';
import { MultiCanvas } from '../game/canvas';
import {GameLoopService} from './gameloop.service';
import {CanvasService} from './canvas.service';
import {SpritesService} from './sprites.service';
import {MouseService} from './mouse.service';
import {MapService} from './map.service';

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
  @ViewChild('paths') paths: ElementRef;
  @Output() canvasControl: EventEmitter<any> = new EventEmitter();
  @Output() onAnimateSprite: EventEmitter<any> = new EventEmitter<any>();

  canv: MultiCanvas;
  machine: Machine;
  game: GameState;
  good = false;
  height: number;
  width: number;


  constructor(public gameloop: GameLoopService,
              public canvas: CanvasService,
              public sprites: SpritesService,
              public map: MapService) { }

  ngAfterContentInit() {
    // this.canv = new MultiCanvas(this.mouse.nativeElement,
    //                             this.cursor.nativeElement,
    //                             this.indicators.nativeElement,
    //                             this.background.nativeElement,
    //                             this.paths.nativeElement);
    // this.game = new GameState();
    // console.log(this.game.state);
    // this.machine = new Machine(this.canv, this.game);

    this.canvas.setHtmlElements(this.mouse.nativeElement,
                                this.cursor.nativeElement,
                                this.indicators.nativeElement,
                                this.background.nativeElement,
                                this.paths.nativeElement);
    this.gameloop.loadGame();
    this.map.loadMap();
    console.log(this.gameloop);

    this.good=true;

    this.height = this.gameloop.size * this.map.height;
    this.width = this.gameloop.size * this.map.width;
  }

  @HostListener('document:keydown.esc')
  onEsc() { this.gameloop.state.esc(); }
  onMouseMove(ev) { this.gameloop.state.mousemove(ev); }
  onMapClick(ev) { this.gameloop.state.mapclick(ev); }
  setPlayerTurn() { console.log('set player turn'); }
  getSelected() { return this.gameloop.selected; }


}
