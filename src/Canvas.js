var THREE = require('three')

function Tris3dCanvas (width, height) {
  var scene = this.scene = new THREE.Scene()

  var camera = this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 5

  var renderer = this.renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)

  var geometry = new THREE.BoxGeometry(1, 1, 1)
  var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  var cube = this.cube = new THREE.Mesh(geometry, material)
  scene.add(cube)
}

module.exports = Tris3dCanvas
