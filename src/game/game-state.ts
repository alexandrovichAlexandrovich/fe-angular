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
          },
          // inventory: [
          //   {
          //     item: 'Silver Sword',
          //     id: 'silversword',
          //     uses: 24,
          //     target: 'enemy',
          //     equippable: true
          //   },
          //   {
          //     name: 'Vulenary',
          //     id: 'vulenary',
          //     uses: 2,
          //     target: 'self',
          //     equippable: false
          //   },
          //   {
          //     name: 'Mend',
          //     id: 'mend',
          //     uses: 5,
          //     target: 'ally',
          //     equippable: true
          //   },
          // ]
        }
      }
    }
  };
}
