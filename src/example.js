var Tris3dCanvas = require('tris3d-canvas')

var tris3dCanvas = new Tris3dCanvas(400, 400)

var camera = tris3dCanvas.camera
var board = tris3dCanvas.board
var renderer = tris3dCanvas.renderer
var scene = tris3dCanvas.scene

document.body.appendChild(renderer.domElement)

function render () {
  window.requestAnimationFrame(render)

  board.cubes[0].mesh.rotation.y += 0.01

  renderer.render(scene, camera)
}

render()
