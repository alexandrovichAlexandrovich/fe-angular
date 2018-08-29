import {GameState} from './game-state';
import {MultiCanvas} from './canvas';

export class Machine {

  canv: MultiCanvas;
  game: GameState;

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
        if(this.clickedOnUnit(ev)){
          console.log("free: map clicked on unit");
          this.transition(this.states.selected);
        } else {
          console.log("free: map clicked off unit");
        }
      },
      esc: () => {console.log("free: esc")},
      leave: () => {console.log("leaving free state")}
    },

    /**
     * Single unit selected
     */

    selected: {
      enter: () => {console.log('entering selected state')},
      mousemove: (ev) => {console.log('selected: mouse move')},
      mapclick: (ev) => {
        console.log('selected: mapclick')
        this.transition(this.states.animating)
      },
      esc: () => {
        console.log('selected: esc');
        this.transition(this.states.free);
       },
      leave: () => {console.log('leaving selected state')}
    },

    /**
     * Blocked while animating
     */

    animating: {
      enter: () => {
        console.log('animating...')
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

  private clickedOnUnit(ev: any) {
    return true;
  }

  private animateMovement() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('animation done.');
        resolve();
      }, 1000);
    });
  }
}
