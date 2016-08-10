const THREE = require('three')
const staticProps = require('static-props')
const OrbitControls = require('three-orbitcontrols')
const EventEmitter = require('events')

class Tris3dCanvas extends EventEmitter {
  /**
   * Create a tris3d canvas
   *
   * @param {String} id of canvas element
   *
   * @constructor
   */

  constructor (id) {
    super()

    // Get canvas, its offset, width and height.
    // //////////////////////////////////////////////////////////////////////

    const canvas = document.getElementById(id)
    var offsetLeft = canvas.offsetLeft
    var offsetTop = canvas.offsetTop
    var width = canvas.width
    var height = canvas.height

    const cellSize = 1.7

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 7.1

    // Create 3x3x3 cubes.
    // //////////////////////////////////////////////////////////////////////

    // The 3d cubes array.
    var cubes = []

    // Remember (mesh cube) <--> (cell) association, using cube uuids.
    var cellUuids = []

    // Default material.
    const neutral = {
      color: 0x000000,
      opacity: 0.17,
      transparent: true,
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

          cellUuids.push(cube.uuid)
        }
      }
    }

    // Create renderer.
    // //////////////////////////////////////////////////////////////////////

    const renderer = new THREE.WebGLRenderer({ canvas })
    renderer.setSize(width, height)
    renderer.setClearColor(0xeeeeee)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.sortObjects = false

    // Navigation controls.
    // //////////////////////////////////////////////////////////////////////

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = false

    // Init event listeners.
    // //////////////////////////////////////////////////////////////////////

    function onMouseDown (event) {
      event.preventDefault()

      if (this.isPlaying) {
        const humanPlayerIndex = this.humanPlayerIndex
        const playerIndex = this.playerIndex
        const selectedCube = this.selectedCube

        if (selectedCube && (playerIndex === humanPlayerIndex)) {
          var cubeIndex = cellUuids.indexOf(selectedCube.uuid)
          this.setChoice(playerIndex, cubeIndex)
        }
      }
    }

    function onMouseMove (event) {
      event.preventDefault()
      // Cannot call `event.stopPropagation()`,
      // otherwise the orbit control does not work.

      // Find intersected cubes.

      var x = (event.offsetX || event.clientX - offsetLeft)
      var y = (event.offsetY || event.clientY - offsetTop)

      var vector = new THREE.Vector3(
        (x / width) * 2 - 1,
        -(y / height) * 2 + 1,
        1
      )

      vector.unproject(camera)

      var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize())
      var intersectedCubes = ray.intersectObjects(cubes)

      if (intersectedCubes.length > 0) {
        this.selectedCube = intersectedCubes[0].object
      } else {
        this.selectedCube = null
      }
    }

    canvas.addEventListener('mousemove', onMouseMove.bind(this), false)
    canvas.addEventListener('mousedown', onMouseDown.bind(this), false)

    // Finally, add attributes.
    // //////////////////////////////////////////////////////////////////////

    this.choosen = []
    this.humanPlayerIndex = 0
    this.isPlaying = true
    this.playerIndex = 0
    this.selectedCube = null

    const playerColors = [
      0xff0000,
      0x00ff00,
      0x0000ff
    ]

    staticProps(this)({
      camera,
      canvas,
      cubes,
      playerColors,
      scene,
      renderer
    })
  }

  /**
   * Start rendering the 3d scene.
   */

  render () {
    const self = this

    const {
      camera,
      renderer,
      scene
    } = this

    var previousSelectedCube = null
    var selectedCube = null

    // The main 3d loop.
    // //////////////////////////////////////////////////////////////////////

    function loop () {
      previousSelectedCube = selectedCube
      selectedCube = self.selectedCube

      if (selectedCube) {
        if (previousSelectedCube && selectedCube.uuid !== previousSelectedCube.uuid) {
          previousSelectedCube.material.opacity = 0.17
        } else {
          selectedCube.material.opacity = 0.71
        }
      } else {
        if (previousSelectedCube) {
          previousSelectedCube.material.opacity = 0.17
        }
      }

      renderer.render(scene, camera)

      window.requestAnimationFrame(loop)
    }

    loop() // Oh yeah!
  }

  /**
   * Set player choice.
   */

  setChoice (playerIndex, cubeIndex) {
    // Nothing to do if choice is already taken.
    const choiceIsNotAvailable = (this.choosen.indexOf(cubeIndex) > -1)
    if (choiceIsNotAvailable) return

    // Store player choice and notify listeners.
    this.choosen.push(cubeIndex)
    this.emit('setChoice', cubeIndex)

    // Color chosen cube.
    const color = this.playerColors[playerIndex]
    this.cubes[cubeIndex].material.color.setHex(color)
    this.cubes[cubeIndex].material.transparent = false

    // Next turn to play.
    this.playerIndex = (playerIndex + 1) % 3
    this.emit('nextPlayer', this.playerIndex)
  }
}

export default Tris3dCanvas
