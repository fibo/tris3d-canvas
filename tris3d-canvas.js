const THREE = require('three')
const staticProps = require('static-props')
const OrbitControls = require('three-orbitcontrols')

class Tris3dCanvas {
  constructor (id) {
    const canvas = document.getElementById(id)
    const cellSize = 1.7

    const width = canvas.width
    const height = canvas.height

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 7.1

    // Create 3x3x3 cubes

    let cubes = []

    const neutral = {
      color: 0x00bb11,
      opacity: 0.17,
      transparent: true
    }

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        for (let k = -1; k < 2; k++) {
          const geometry = new THREE.BoxGeometry(1, 1, 1)
          const material = new THREE.MeshBasicMaterial(neutral)

          const cube = new THREE.Mesh(geometry, material)
          cubes.push(cube)

          cube.position.x = i * cellSize
          cube.position.y = j * cellSize
          cube.position.z = k * cellSize

          scene.add(cube)
        }
      }
    }

    const renderer = new THREE.WebGLRenderer({ canvas })
    renderer.setSize(width, height)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = false

    staticProps(this)({ scene, camera, renderer })
  }

  render () {
    const { renderer, scene, camera } = this

    function loop () {
      window.requestAnimationFrame(loop)
      renderer.render(scene, camera)
    }

    loop() // oh yeah!
  }
}

export default Tris3dCanvas
