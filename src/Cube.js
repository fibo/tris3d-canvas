var THREE = require('three')

export default class Tris3dCube {
  constructor (board, position) {
    const defaultColor = new THREE.Color(0xaa0000)
    const defaultOpacity = 0.17
    const size = board.cubeSize

    const geometry = new THREE.BoxGeometry(size, size, size)

    const material = new THREE.MeshBasicMaterial({
      color: defaultColor,
      opacity: defaultOpacity,
      transparent: true
    })

    let mesh = new THREE.Mesh(geometry, material)

    mesh.position.x = position.x * board.unitSize
    mesh.position.y = position.y * board.unitSize
    mesh.position.z = position.z * board.unitSize
  }
}
