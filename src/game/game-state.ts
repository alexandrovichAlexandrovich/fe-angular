export class GameState {
  state = {
    player: {
      units: {
        names: ['Alice'],
        Alice: {
          name: 'Alice',
          class: 'lordf',
          mvt: 5,
          position: {
            x: 2,
            y: 0
          }
        }
      }
    },
    enemy: {
      units: {
        names: ['Bob'],
        Bob: {
          name: 'Bob',
          class: 'brigandm',
          mvt: 5,
          position:{
            x: 1,
            y: 0
          }
        }
      }
    }
  };

  moveAlice(newPos: {x: number, y: number}){
    this.state.player.units['Alice'].position = newPos;
  }
}
