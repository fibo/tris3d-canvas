var staticProps = require('static-props')
var THREE = require('three')

function Tris3dCube (cubeSize, unitSize, position) {
  var defaultColor = new THREE.Color(0xaa0000)
  var defaultOpacity = 0.17

  var geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)

  var material = new THREE.MeshBasicMaterial({
    color: defaultColor,
    opacity: defaultOpacity,
    transparent: true
  })

  var mesh = new THREE.Mesh(geometry, material)

  mesh.position.x = position.x * unitSize
  mesh.position.y = position.y * unitSize
  mesh.position.z = position.z * unitSize

  staticProps(this)({
    mesh: mesh
  })
}

module.exports = Tris3dCube
