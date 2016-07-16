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

    const rayCaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

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
    renderer.setClearColor(0xeeeeee, 1)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = false

    // Finally, add attributes.

    staticProps(this)({
      camera,
      canvas,
      cubes,
      pointer,
      scene,
      rayCaster,
      renderer
    })
  }

  disablePicking () {
    // TODO
  }

  getEventCoords (event) {
    const { canvas, pointer } = this

    pointer.x = (event.clientX / canvas.width) * 2 - 1
    pointer.y = - (event.clientY / canvas.height) * 2 - 1

    console.log(pointer.x, pointer.y)
  }

  enablePicking () {
    const { canvas } = this

    const selectPickedCube = this.selectPickedCube.bind(this)

    // TODO canvas.addEventListener('mousedown', selectPickedCube)
    canvas.addEventListener('mousemove', getEventCoords)
    // TODO pick object after 1 second holding mousedown
    // in the mean time the object rotates or gives a feedback
  }

  selectPickedCube (event) {
    // Code from here http://stackoverflow.com/questions/29366109/three-js-three-projector-has-been-moved-to

    const { camera, cubes, rayCaster, renderer } = this

    pointer.x = (event.clientX / renderer.domElement.width) * 2 - 1
    pointer.y = - (event.clientY / renderer.domElement.height) * 2 - 1

    rayCaster.setFromCamera(pointer, camera)

    const intersects = rayCaster.intersectObjects(cubes)
    console.log(intersects)
  }

  render () {
    const { camera, renderer, scene } = this

    // TODO Like http://threejs.org/docs/api/core/Raycaster.html
    // calculate picking to give feedback to user

    function loop () {
      window.requestAnimationFrame(loop)
      renderer.render(scene, camera)
    }

    loop() // oh yeah!
  }
}

export default Tris3dCanvas
