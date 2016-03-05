# tris3d-canvas

> is a placeholder to play tic tac toe in 3d

**Table of Contents**

* [Installation](#installation)
* [Usage](#usage)
* [API](#api)
* [License](#license)

[![NPM version](https://badge.fury.io/js/tris3d-canvas.svg)](http://badge.fury.io/js/tris3d-canvas) [![Dependency Status](https://gemnasium.com/fibo/tris3d-canvas.svg)](https://gemnasium.com/fibo/tris3d-canvas) [![Change log](https://img.shields.io/badge/change-log-blue.svg)](https://github.com/fibo/tris3d-canvas/blob/master/CHANGELOG.md)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

[![NPM](https://nodei.co/npm-dl/tris3d-canvas.png)](https://nodei.co/npm-dl/tris3d-canvas/)

## Status


## Installation

With [npm](https://npmjs.org/) do

```bash
$ npm install tris3d-canvas
```

With [bower](http://bower.io/) do

```bash
$ bower install tris3d-canvas
```

or use a CDN adding this to your HTML page

```
<script src="https://cdn.rawgit.com/fibo/tris3d-canvas/master/dist/tris3d-canvas.min.js"></script>
```

## Usage

```
var Tris3dCanvas = require('tris3d-canvas')

var camera = tris3dCanvas.camera
var cube = tris3dCanvas.cube
var renderer = tris3dCanvas.renderer
var scene = tris3dCanvas.scene

var scene = Tris3dCanvas.scene

document.body.appendChild(renderer.domElement)

var render = function () {
  requestAnimationFrame(render)

  cube.rotation.x += 0.1
  cube.rotation.y += 0.1

  renderer.render(scene, camera)
}

render()
```

## API

## License

[MIT](http://g14n.info/mit-license)

