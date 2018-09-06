export class GameState {
  state = {
    moves: [],
    player: {
      units: {
        names: ['Eirikah', 'Ross'],
        Eirikah: {
          name: 'Eirikah',
          class: 'lordf',
          sleep: false,
          mvt: 5,
          position: {
            x: 2,
            y: 0
          },
          inventory: [
            {
              item: 'Silver Sword',
              id: 'silversword',
              uses: 24,
              // target: 'enemy',
              // equippable: true,
              // range: [1,1]
            },
            {
              item: 'Vulenary',
              id: 'vulenary',
              uses: 24,
              // target: 'enemy',
              // equippable: true,
              // range: [1,1]
            }
          ]
        },
        Ross: {
          name: 'Ross',
          class: 'brigandm',
          sleep: true,
          mvt: 7,
          position: {
            x: 1,
            y: 0
          },
          inventory: [
            {
              item: 'Iron Bow',
              id: 'ironbow',
              uses: 10,
              // target: 'enemy',
              // equippable: true,
              // range: [2,2]
            },
            {
              item: 'Whacky Guy',
              id: 'mace',
              uses: 99,
              // target: 'enemy',
              // equippable: true,
              // range: [1,1]
            }
          ]
        }
      }
    }
  };
}
