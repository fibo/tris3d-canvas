var Tris3dCanvas = require('tris3d-canvas')

var el = document.createElement('div')
el.innerHTML=Tris3dCanvas.component
document.body.appendChild(el)
/*

var tris3dCanvas = new Tris3dCanvas(400, 400)

var camera = tris3dCanvas.camera
var controls = tris3dCanvas.controls
var board = tris3dCanvas.board
var renderer = tris3dCanvas.renderer
var scene = tris3dCanvas.scene

document.body.appendChild(renderer.domElement)

function render () {
  window.requestAnimationFrame(render)

  controls.update()

  board.cubes[0].mesh.rotation.y += 0.01

  renderer.render(scene, camera)
}

render()
*/
