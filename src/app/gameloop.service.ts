import { Injectable } from '@angular/core';
import {CanvasService} from './canvas.service';
import {GameState} from '../game/game-state';
import {SpritesService} from './sprites.service';
import {MouseService} from './mouse.service';
import {Map} from '../game/map';
import {MapService} from './map.service';

@Injectable({
  providedIn: 'root'
})
export class GameLoopService {

  game;
  units;
  selected;
  state;
  // map = new Map;
  size = 30;

  waiting = false;
  enemyTurn = false;

  constructor(public canvas: CanvasService,
              public sprites: SpritesService,
              public map: MapService) { }

  states = {
    /**
     * Free selection state
     */

    init: {
      enter: (ev?) => {},
      mousemove: (ev?) => {},
      mapclick: (ev?) => {},
      esc: (ev?) => {},
      leave: (ev?) => {}
    },

    blocked: {
      enter: (ev?) => {
        console.log('Entering blocked state');
        this.canvas.eraseIndicators();
        this.sprites.hideCursor();
        setTimeout(() => {
          this.sprites.showCursor();
          console.log('showed cursor');
        }, 1000);
        // this.checkForPlayerTurn()
        //   .then(() => {
        //     if(this.allUnitsAsleep()) {
        //       this.freeAllUnits();
        //     }
        //     this.show('Player phase');
        //     this.transition(this.states.free);
        //   });
      },
      mousemove: (ev?) => {},
      mapclick: (ev?) => {},
      esc: (ev?) => {},
      leave: (ev?) => {}
    },

    free: {
      enter: (ev?) => {
        this.waiting = false;
        for(const name of this.units.names) {
          this.units[name].status = this.units[name].sleep ? 'sleep' : 'selected';
        }
        this.sprites.setUnits(this.units);
        this.sprites.showCursor();
        this.canvas.eraseIndicators();
        console.log('entering free state');
        if (this.allUnitsAsleep()) {
          this.enemyTurn = true;
          this.transition(this.states.blocked);
        }
      },
      mousemove: (ev?) => {
        this.canvas.eraseIndicators();
        this.canvas.setMousePosition(ev);
        const unit = this.mouseOverUnit(ev);
        if(unit !== null) {
          this.selected = unit;
          if (!unit.sleep) {
            this.canvas.drawMovementRange(unit);
          }
        } else {
          this.selected = {};
        }
      },
      mapclick: (ev?) => {
        const unit = this.mouseOverUnit(ev);
        if (unit && !unit.sleep) {
          console.log('free: map clicked on unit');
          this.selected = unit;
          this.transition(this.states.selected);
        } else {
          console.log('free: map clicked off unit');
        }
      },
      esc: (ev?) => {
        console.log('free: esc');
      },
      leave: (ev?) => {
        console.log('leaving free state');
        this.canvas.eraseIndicators();
      }
    },

    selected: {
      enter: (ev?) => {
        this.canvas.drawMovementRange(this.selected);
        if (this.selected === null) {
          throw new Error('WHAT THE FUCK DID YOU DO');
        } else {
          console.log('entering selected state with '+this.selected.name+' selected.');
        }
      },
      mousemove: (ev?) => {
        this.canvas.setMousePosition(ev);
        this.canvas.drawPathMarkers(this.selected);
      },
      mapclick: (ev?) => {
        console.log('selected: mapclick');
        this.canvas.setMousePosition(ev);
        const tile = this.canvas.mouseTile;
        const path = this.canvas.getMovementChart(this.selected)[tile.x][tile.y].path;
        const validMove = path && (!this.isOccupied(tile));
        if (validMove) {
          console.log('can move there');
          const animation = {unit: this.selected,
                             path: path,
                             target: tile};
          this.transition(this.states.animating, animation);
        } else {
          console.log('can\'t move there');
        }
      },
      esc: (ev?) => {
        console.log('selected: esc');
        this.transition(this.states.free);
      },
      leave: (ev?) => {
        this.canvas.eraseIndicators();
        this.selected = {};
      }
    },

    animating: {
      enter: (ev?) => {
        console.log('animating...');
        this.sprites.animateMovement(ev)
          .then(() => {
            ev.unit.position=ev.target;
            ev.unit.status='sleep';
            ev.unit.sleep = true;
            this.transition(this.states.free);
          });
        ev.unit.sleep = true;
      },
      mousemove: (ev?) => {},
      mapclick: (ev?) => {},
      esc: (ev?) => {},
      leave: (ev?) => {}
    },

    menu: {
      enter: (ev?) => {},
      mousemove: (ev?) => {},
      mapclick: (ev?) => {},
      esc: (ev?) => {},
      leave: (ev?) => {}
    }

  };

  private transition(nextState, ev?): void {
    if(ev){
      this.state.leave(ev);
      this.state = nextState;
      this.state.enter(ev);
    } else {
      this.state.leave();
      this.state = nextState;
      this.state.enter();
    }
  }


  loadGame(){
    this.game = new GameState;
    console.log(this.map);
    this.units = this.game.state.player.units;
    this.state = this.states.init;
    this.selected = {};

    this.sprites.setSize(this.size);
    this.sprites.setUnits(this.units);

    for(const name of this.units.names) {
      this.units[name].status = this.units[name].sleep ? 'sleep' : 'selected';
    }

    this.canvas.setSize(this.size);

    // this.transition(this.states.blocked);
    // Temporary for testing
    this.transition(this.states.free);
  }

  private allUnitsAsleep() {
    for (const name of this.units.names) {
      if (!this.units[name].sleep) { return false; }
    }
    return true;
  }

  private mouseOverUnit(ev: any) {
    const mouse = this.canvas.mousePosition;
    for (const name of this.units.names) {
      const unit = this.units[name].position;
      if (unit.x === mouse.x / this.size && unit.y === mouse.y / this.size) {
        return this.units[name];
      }
    }
    return null;
  }

  private isOccupied(tile: { x: number; y: number }) {
    for (const name of this.units.names) {
      const pos = this.units[name].position;
      if(pos.x === tile.x && pos.y === tile.y) {
        return true;
      }
    }
    return false;
  }
}
