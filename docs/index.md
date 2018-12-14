---
title: tris3d-canvas
---
# tris3d-canvas

> is a canvas to play tic tac toe in 3d

[Installation](#installation) |
[API](#api) |
[License](#license)

[![NPM version](https://badge.fury.io/js/tris3d-canvas.svg)](http://badge.fury.io/js/tris3d-canvas)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Installation

With [npm] do

```bash
npm install three tris3d-canvas
```

Note that [three.js](https://threejs.org/) is required as a peer dependency.

## API

See [online example][online_example] or do the following to run [example.js][example_js]

```bash
npm install
npm start
```

### `const tris3dCanvas = new Tris3dCanvas(canvasId, opts)`

> Constructor to create an instance of Tris3dCanvas.

Create a canvas with attribute `id`, inside a div container with `display: block` style

```html
<div style="display: block">
  <canvas id="demo"></canvas>
</div>
```

Then create a Tris3dCanvas object

```javascript
const tris3dCanvas = new Tris3dCanvas('demo')
```

Optional parameters are accepted after `canvasId`, constructor signature
is the following:

* **@param** `{String}` **id** of canvas element
* **@param** `{Object}` **[opt]** optional parameters
* **@param** `{Array}` **[opt.playerColors]** are three colors, like 0xff0000
* **@param** `{Array}` **[opt.backgroundColor]** defaults to 0xffffff

### `tris3dCanvas.localPlayerIndex`

Can be 0, 1, 2. Defaults to 0, which means the local player moves first.

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
