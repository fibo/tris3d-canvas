var staticProps = require('static-props')
var Tris3dCube = require('./Cube')

function Tris3dBoard (scene) {
  var cubes = []
  var cubeSize = 2
  var unitSize = 5

  // Create 3x3x3 cubes
  for (var i = -1; i < 2; i++) {
    for (var j = -1; j < 2; j++) {
      for (var k = -1; k < 2; k++) {
        var position = {x: k, y: j, z: i}
        var cube = new Tris3dCube(cubeSize, unitSize, position)
        cubes.push(cube)
        scene.add(cube.mesh)
      }
    }
  }

  staticProps(this)({
    cubes: cubes
  })
}

module.exports = Tris3dBoard
