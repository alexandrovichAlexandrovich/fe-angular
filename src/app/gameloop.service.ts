import { Injectable } from '@angular/core';
import {CanvasService} from "./canvas.service";
import {GameState} from "../game/game-state";
import {SpritesService} from "./sprites.service";

@Injectable({
  providedIn: 'root'
})
export class GameLoopService {

  game;
  units;
  selected;
  state;
  size = 30;

  constructor(public canv: CanvasService, public sprites: SpritesService){
    this.game = this.loadGame();
    this.units = this.game.state.player.units;
    this.state = this.states.init;
    this.selected = {};
    this.sprites.set(this.units, this.size);
    for(const name of this.units.names) {
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
      enter: (ev?) => {},
      mousemove: (ev?) => {},
      mapclick: (ev?) => {},
      esc: (ev?) => {},
      leave: (ev?) => {}
    },

    free: {
      enter: (ev?) => {},
      mousemove: (ev?) => {},
      mapclick: (ev?) => {},
      esc: (ev?) => {},
      leave: (ev?) => {}
    },

    selected: {
      enter: (ev?) => {},
      mousemove: (ev?) => {},
      mapclick: (ev?) => {},
      esc: (ev?) => {},
      leave: (ev?) => {}
    },

    animating: {
      enter: (ev?) => {},
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
    return GameState;
  }
}
