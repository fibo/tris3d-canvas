var Tris3dCanvas = require('tris3d-canvas')

var tris3dCanvas = new Tris3dCanvas(300, 300)

var camera = tris3dCanvas.camera
// var cube = tris3dCanvas.cube
var renderer = tris3dCanvas.renderer
var scene = tris3dCanvas.scene

document.body.appendChild(renderer.domElement)

var render = function () {
  requestAnimationFrame(render)

//  cube.mesh.rotation.x += 0.1
//  cube.mesh.rotation.y += 0.1

  renderer.render(scene, camera)
}

render()
