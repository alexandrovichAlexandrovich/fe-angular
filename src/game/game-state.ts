export class GameState {
  state = {
    player: {
      units: {
        names: ['Alice', 'Bob'],
        Alice: {
          name: 'Alice',
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
              target: 'enemy',
              equippable: true,
              range: [1,1]
            }
          ]
        },
        Bob: {
          name: 'Bob',
          class: 'brigandm',
          sleep: false,
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
              target: 'enemy',
              equippable: true,
              range: [2,2]
            }
          ]
        }
      }
    }
  };
}
