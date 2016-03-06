var staticProps = require('static-props')
var THREE = require('three')
var Tris3dCube = require('./Cube')

function Tris3dCanvas (width, height) {
  var scene = this.scene = new THREE.Scene()

  var camera = this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 5

  var renderer = this.renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)

  var cube = new Tris3dCube()
  scene.add(cube.mesh)

  staticProps(this)({ cube: cube })
}

module.exports = Tris3dCanvas
