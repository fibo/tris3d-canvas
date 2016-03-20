var staticProps = require('static-props')
var THREE = require('three')
var Tris3dBoard = require('./Board')

function Tris3dCanvas (width, height) {
  var backgroundColor = 0xeeeeee
  var scene = new THREE.Scene()

  var camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000)
  camera.position.z = 15

  var renderer = new THREE.WebGLRenderer({
    antialias: true,
    clearAlpha: 1
  })

  renderer.setClearColor(backgroundColor, 1)
  renderer.setSize(width, height)

  var board = new Tris3dBoard(scene)

  staticProps(this)({
    board: board,
    camera: camera,
    renderer: renderer,
    scene: scene
  })
}

module.exports = Tris3dCanvas
