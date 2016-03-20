var Tris3dCanvas = require('tris3d-canvas')

var tris3dCanvas = new Tris3dCanvas(400, 400)

var camera = tris3dCanvas.camera
var cube = tris3dCanvas.cube
var renderer = tris3dCanvas.renderer
var scene = tris3dCanvas.scene

document.body.appendChild(renderer.domElement)

function render () {
  window.requestAnimationFrame(render)

  cube.mesh.rotation.y += 0.01

  renderer.render(scene, camera)
}

render()
