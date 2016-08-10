import Tris3dCanvas from 'tris3d-canvas'
const stupid = require('tris3d-ai').stupid

const tris3dCanvas = new Tris3dCanvas('demo')

tris3dCanvas.on('setChoice', (cubeIndex) => {
  console.log('cubeIndex', cubeIndex)
})

tris3dCanvas.on('nextPlayer', (playerIndex) => {
  console.log('nextPlayer', playerIndex)

  const isBotPlayTurn = (tris3dCanvas.humanPlayerIndex !== playerIndex)

  // Bot choices.
  if (isBotPlayTurn) {
    const nextChoice = stupid(tris3dCanvas.choosen)

    // Just a little bit of random delay.
    var delay = 1700 + Math.random() * 7100

    setTimeout(() => {
      tris3dCanvas.setChoice(playerIndex, nextChoice)
    }, delay)
  }
})

tris3dCanvas.render()
