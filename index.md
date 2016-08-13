---
title: tris3d-canvas
---
# tris3d-canvas

> is a canvas to play tic tac toe in 3d

[Installation](#installation) |
[Example](#example) |
[API](#api) |
[License](#license)

[![NPM version](https://badge.fury.io/js/tris3d-canvas.svg)](http://badge.fury.io/js/tris3d-canvas)
[![Dependency Status](https://gemnasium.com/fibo/tris3d-canvas.svg)](https://gemnasium.com/fibo/tris3d-canvas)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Installation

With [npm] do

```bash
npm install tris3d-canvas
```

## Example

See [online example][online_example] or do the following to run [example.js][example_js]

```bash
npm install
npm start
```

## API

### `const tris3dCanvas = new Tris3dCanvas(canvasId)`

> Constructor to create an instance of Tris3dCanvas.

Create a canvas with attributes `id`, `width` and `height`

```html
<canvas id="demo" width="500" height="500"></canvas>
```

Then create a Tris3dCanvas object

```javascript
const tris3dCanvas = new Tris3dCanvas('demo')
```

### `tris3dCanvas.on('localPlayerTurnEnds', () => {})`

> Listen to *localPlayerTurnEnds* event.

### `tris3dCanvas.on('localPlayerTurnStarts', () => {})`

> Listen to *localPlayerTurnStarts* event.

### `tris3dCanvas.on('nextPlayer', (playerIndex) => {})`

> Listen to *nextPlayer* event.

### `tris3dCanvas.on('nobodyWins', () => {})`

> Listen to *nobodyWins* event.

### `tris3dCanvas.on('setChoice', (cubeIndex) => {})`

> Listen to *setChoice* event.

### `tris3dCanvas.on('tris3d!', (winnerPlayerIndex, winningCombinations) => {})`

> Listen to *tris3d!* event.

### `tris3dCanvas.render()`

> Start rendering the 3d scene.

### `tris3dCanvas.setChoice(playerIndex, cubeIndex)`

> Set player choice.

### `tris3dCanvas.resetPlayground()`

> Reset playground without start playing a new match.

### `tris3dCanvas.startNewMatch()`

> Start a brand new match

## License

[MIT](http://g14n.info/mit-license)

[example_js]: https://github.com/fibo/tris3d-canvas/blob/master/example.js
[npm]: https://npmjs.org/
[online_example]: http://g14n.info/tris3d-canvas/example
