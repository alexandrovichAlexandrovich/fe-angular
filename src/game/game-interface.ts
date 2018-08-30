import {GameState} from './game-state';
import {MultiCanvas} from './canvas';
import * as assert from 'assert';

export class Machine {

  canv: MultiCanvas;
  game: GameState;
  selected: any;
  name: string;

  constructor(canv, game){
    this.canv = canv;
    this.game = game;
    this.transition(this.states.free);
  }

  states = {
    /**
     * Free selection state
     */

    init: {
      enter: () => {},
      mousemove: (ev) => {},
      mapclick: (ev) => {},
      esc: () => {},
      leave: () => {}
    },

    free: {
      enter: () => {
        this.canv.drawGrid();
        console.log('entering free state');
      },
      mousemove: (ev) => {
        this.canv.getMousePosAndDrawCursor(ev);
      },
      mapclick: (ev) => {
        let unit = this.clickedOnUnit(ev);
        console.log(unit);
        if(unit !==  null){
          console.log('free: map clicked on unit');
          this.selected = unit;
          this.transition(this.states.selected);
        } else {
          console.log('free: map clicked off unit');
        }
      },
      esc: () => {console.log('free: esc');},
      leave: () => {
        console.log('leaving free state');
        this.canv.eraseIndicators();
      }
    },

    /**
     * Single unit selected
     */

    selected: {
      enter: () => {
        console.log('entering selected state');
        this.canv.drawMovementRange(this.selected);
        assert(this.selected !== null);
        },
      mousemove: (ev) => {this.canv.getMousePosAndDrawCursor(ev);},
      mapclick: (ev) => {
        console.log('selected: mapclick');
        if (this.canv.canMove(this.selected, this.canv.getMousePos(ev))){
          console.log('can move there');
        } else {
          console.log('can\'t move there');
        }
        this.transition(this.states.animating);
      },
      esc: () => {
        console.log('selected: esc');
        this.transition(this.states.free);
       },
      leave: () => {
        console.log('leaving selected state');
        this.selected = null;
        this.canv.eraseIndicators();
      }
    },

    /**
     * Blocked while animating
     */

    animating: {
      enter: () => {
        console.log('animating...');
        this.animateMovement()
          .then(this.transition.bind(this, this.states.free));
      },
      mousemove: (ev) => {},
      mapclick: (ev) => {},
      esc: () => {},
      leave: () => {
        console.log('animation done.');
      }
    }

  };

  state = this.states.init;

  private transition(nextState): void {
    this.state.leave();
    this.state = nextState;
    this.state.enter();
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

  private animateMovement() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('animation done.');
        resolve();
      }, 250);
    });
  }
}
