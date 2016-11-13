import Tris3dCanvas from 'tris3d-canvas'
const bastard = require('tris3d-ai').bastard
const smart = require('tris3d-ai').smart

// Make console.log visible

console.log = function consoleLog () {
  const logger = document.getElementById('log')
  var message = ''

  for (var i = 0; i < arguments.length; i++) {
    if (typeof arguments[i] === 'object') {
      message += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + ' '
    } else {
      message += arguments[i] + ' '
    }
  }

  logger.innerHTML = message + '<br/>' + logger.innerHTML
}

const tris3dCanvas = new Tris3dCanvas('demo')

tris3dCanvas.on('localPlayerTurnEnds', () => {
  console.log('wait for other players choices')
})

tris3dCanvas.on('localPlayerTurnStarts', () => {
  console.log('is my turn')
})

tris3dCanvas.on('nextPlayer', (playerIndex) => {
  console.log('nextPlayer', playerIndex)

  const isOtherPlayerTurn = (tris3dCanvas.localPlayerIndex !== playerIndex)

  // Bot choices.
  if (isOtherPlayerTurn) {
    // Just a little bit of random delay.
    var delay = 710 + Math.random() * 1700

    setTimeout(() => {
      var bot

      // Flip a coin, use smart ot bastar bot.
      if (Math.random() < 0.5) {
        bot = smart
      } else {
        bot = bastard
      }

      var nextChoice = bot(tris3dCanvas.choosen)

      tris3dCanvas.setChoice(nextChoice)
    }, delay)
  }
})

tris3dCanvas.on('nobodyWins', () => {
  console.log('Nobody wins :(')

  setTimeout(() => {
    tris3dCanvas.startNewMatch()
  }, 1700)
})

tris3dCanvas.on('setChoice', (cubeIndex) => {
  console.log('setChoice', cubeIndex)
})

tris3dCanvas.on('tris3d!', (winnerPlayerIndex, winningCombinations) => {
  console.log('tris3d!')
  console.log('winnerPlayerIndex', winnerPlayerIndex)
  console.log('winningCombinations', winningCombinations)

  setTimeout(() => {
    tris3dCanvas.startNewMatch()
  }, 7100)
})

tris3dCanvas.render()
tris3dCanvas.startNewMatch()

