var THREE = require('three')

function Tris3dCube (/* board, position */) {
  var defaultColor = new THREE.Color(0xaa0000)
  var defaultOpacity = 0.17
  // var size = board.cubeSize
  var size = 1

  var geometry = new THREE.BoxGeometry(size, size, size)

  var material = new THREE.MeshBasicMaterial({
    color: defaultColor,
    opacity: defaultOpacity,
    transparent: true
  })

  var mesh = new THREE.Mesh(geometry, material)

  this.mesh = mesh

//  mesh.position.x = position.x * board.unitSize
//  mesh.position.y = position.y * board.unitSize
//  mesh.position.z = position.z * board.unitSize
}

module.exports = Tris3dCube
