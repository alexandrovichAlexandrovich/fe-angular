import {GameState} from './game-state';
import {MultiCanvas} from './canvas';
// import * as assert from "assert";

export class Machine {

  canv: MultiCanvas;
  game: GameState;
  units : any;
  selected: any;
  name: string;
  animating: any;

  map = new Map();
  tileSize = 30;

  mouse = {x: 0, y: 0};
  showcursor = false;
  waiting = true;
  enemyTurn = true;

  constructor(canv, game){
    this.canv = canv;
    this.game = game;
    this.units = this.game.state.player.units;
    this.selected = {};
    for(const name of this.units.names) {
      this.updateRealizedPosition(name);
      this.units[name].status = this.units[name].sleep ? 'sleep' : 'selected';
    }
    this.transition(this.states.blocked);
  }

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
        this.canv.eraseIndicators();
        this.showcursor = false;
        this.checkForPlayerTurn()
          .then(() => {
            if(this.allUnitsAsleep()) {
              this.freeAllUnits();
            }
            this.show('Player phase');
            this.transition(this.states.free);
          });
      },
      mousemove: (ev?) => {
        this.mouse = this.canv.getMousePos(ev);
        const unit = this.clickedOnUnit(ev);
        this.canv.eraseIndicators();
        if (unit !== null) {
          this.selected = unit;
        } else {
          this.selected = {};
        }
      },
      mapclick: (ev?) => {},
      esc: (ev?) => {},
      leave: (ev?) => {
        this.enemyTurn = false;
        this.selected = {};
      }
    },

    free: {
      enter: (ev?) => {
        this.waiting = false;
        for(const name of this.units.names) {
          this.updateRealizedPosition(name);
          this.units[name].status = this.units[name].sleep ? 'sleep' : 'selected';
        }
        this.showcursor = true;
        this.canv.drawGrid();
        this.canv.eraseIndicators();
        console.log('entering free state');
        console.log(this.game.state.player.units);
        if(this.allUnitsAsleep()){
          this.enemyTurn = true;
          this.transition(this.states.blocked);
        }
      },
      mousemove: (ev?) => {
        this.showcursor = true;
        this.mouse = this.canv.getMousePos(ev);
        const unit = this.clickedOnUnit(ev);
        this.canv.eraseIndicators();
        if (unit !== null) {
          this.selected = unit;
          if (!unit.sleep) {
            this.canv.drawMovementRange(unit);
          }
        } else {
          this.selected = {};
        }
      },
      mapclick: (ev?) => {
        const unit = this.clickedOnUnit(ev);
        console.log(unit);
        if(unit !==  null && !unit.sleep){
          console.log('free: map clicked on unit');
          this.selected = unit;
          this.transition(this.states.selected);
        } else {
          console.log('free: map clicked off unit');
        }
      },
      esc: (ev?) => {console.log('free: esc');},
      leave: (ev?) => {
        console.log('leaving free state');
        this.canv.eraseIndicators();
      }
    },

    /**
     * Single unit selected
     */

    selected: {
      enter: (ev?) => {
        console.log('entering selected state');
        this.canv.drawMovementRange(this.selected);
        if(this.selected === null){
          throw new Error('SELECTED IS NULL (game-interface:117)');
        } else {
          console.log('selected unit is '+this.selected);
        }
      },
      mousemove: (ev?) => {
        this.mouse = this.canv.getMousePos(ev);
        const path = this.canv.drawPath(this.selected, this.canv.getMousePos(ev));
        this.canv.clearPathMarkers();
        if (path != null) {
          this.canv.drawPathMarkers(this.selected.position, path);
        }
        // this.canv.getMousePosAndDrawCursor(ev);
      },
      mapclick: (ev?) => {
        console.log('selected: mapclick');
        const path = this.canv.drawPath(this.selected, this.canv.getMousePos(ev));
        const tile = this.canv.getMousePos(ev);
        const standingOnTile = this.selected.position.x === tile.x && this.selected.position.y === tile.y;
        const validMove = path != null && (!this.isOccupied(tile) || standingOnTile);
        if (validMove){
          console.log('can move there');
          this.transition(this.states.animating,
            {unit: this.selected,
                 end: this.canv.getMousePos(ev)}
          );
        } else {
          console.log('can\'t move there');
        }
      },
      esc: (ev?) => {
        console.log('selected: esc');
        this.transition(this.states.free);
       },
      leave: (ev?) => {
        this.canv.clearPathMarkers();
        console.log('leaving selected state');
        this.selected = {};
      }
    },

    /**
     * Blocked while animating
     */

    animating: {
      enter: (ev) => {
        this.showcursor = false;
        console.log('animating...');
        this.animateMovement(ev)
          .then(this.transition.bind(this, this.states.free));
        ev.unit.sleep = true;
      },
      mousemove: (ev?) => {},
      mapclick: (ev?) => {},
      esc: (ev?) => {},
      leave: (ev?) => {
        this.showcursor = true;
        console.log('animation done.');
      }
    }

  };

  updateRealizedPosition(name) {
    const unit = this.game.state.player.units[name];
    const pos = unit.position;
    unit.realPos = {x: pos.x * this.tileSize, y: pos.y * this.tileSize};
  }

  private allUnitsAsleep() {
    for(let name of this.game.state.player.units.names) {
      if(!this.game.state.player.units[name].sleep) return false;
    }
    return true;
  }

  state = this.states.init;

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

  private clickedOnUnit(ev: MouseEvent) {
    const clicked = this.canv.getMousePos(ev);
    for (const name of this.game.state.player.units.names) {
      const unit = this.game.state.player.units[name].position;
      if (unit.x === clicked.x && unit.y === clicked.y) {
        return this.game.state.player.units[name];
      }
    }
    return null;
  }

  private animateMovement(ev) {
    return new Promise((resolve) => {
      const path = this.canv.drawPath(ev.unit, ev.end);
      console.log('drew');
      this.movePath(ev.unit, path)
        .then(() => {
          ev.unit.position=ev.end;
          ev.unit.status='sleep';
          resolve();
        });
    });
  }

  private movePath(unit, path){
    // console.log(path);
    return new Promise((resolve) => {
      if (path === ''){
        resolve();
      } else {
        unit.status = path[0];
        this.moveTile(unit, path[0], this.tileSize)
          .then(() => {
            this.movePath(unit, path.slice(1))
              .then(resolve);
            }
            );
      }
    });
  }

  private moveTile(unit, direction, pixelsLeft){
    return new Promise((resolve) => {
      if (pixelsLeft <= 0) {
        this.shiftRealPos(unit, direction, pixelsLeft);
        resolve();
      } else {
        this.shiftRealPos(unit, direction, 2);
        setTimeout(() => {
          // console.log(direction);
          this.moveTile(unit, direction, pixelsLeft-2)
            .then(resolve);
        }, 7);
      }
    });
  }

  private checkForPlayerTurn(){
    this.waiting = true;
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!this.enemyTurn) {
          resolve();
        } else {
          this.checkForPlayerTurn()
            .then(resolve);
        }
      }, 500);
    });
  }

  private shiftRealPos(unit, direction, amount) {
    switch(direction) {
      case 'l':
        unit.realPos.x -= amount;
        break;
      case 'r':
        unit.realPos.x += amount;
        break;
      case 'u':
        unit.realPos.y -= amount;
        break;
      case 'd':
        unit.realPos.y += amount;
        break;
    }
  }

  private freeAllUnits() {
    for (let name of this.game.state.player.units.names) {
      this.game.state.player.units[name].sleep = false;
    }
  }

  private isOccupied(pos) {
    for (let name of this.game.state.player.units.names) {
      const unitPos = this.game.state.player.units[name].position;
      if(unitPos.x === pos.x && unitPos.y === pos.y){
        console.log('Occupied by '+name);
        return true;
      }
    }
    return false;
  }

  private show(s) {
    console.log(s);
  }
}
