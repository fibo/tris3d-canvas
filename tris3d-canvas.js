const EventEmitter = require('events')
const no = require('not-defined')
const OrbitControls = require('three-orbitcontrols')
const staticProps = require('static-props')
const THREE = require('three')
const tris3d = require('tris3d')

class Tris3dCanvas extends EventEmitter {
  /**
   * Create a tris3d canvas
   *
   * @param {String} id of canvas element
   * @param {Object} [opt]
   * @param {Array} [opt.playerColors] are three colors, like 0xff0000
   *
   * @constructor
   */

  constructor (id, opt) {
    super()

    const defaultPlayerColors = [
      0xff0000,
      0x00ff00,
      0x0000ff
    ]

    if (no(opt)) opt = {}

    var playerColors = opt.playerColors || defaultPlayerColors

    // Get canvas, its offset, width and height.
    // //////////////////////////////////////////////////////////////////////

    const canvas = document.getElementById(id)
    const parentElement = canvas.parentElement

    // Make canvas responsive by fill its parent.
    const rect = parentElement.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const width = size
    const height = size

    const style = 'margin:0; padding:0; width: 100%; height: auto;'
    canvas.setAttribute('style', style)

    const cellSize = 1.7

    var scene = new THREE.Scene()

    var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 7.1

    // Create 3x3x3 cubes.
    // //////////////////////////////////////////////////////////////////////

    // The 3d cubes array.
    var cubes = []

    // Remember (mesh cube) <--> (cell) association, using cube uuids.
    var cubeUuids = []

    // Default materials.
    const neutral = {
      color: 0x000000,
      opacity: 0.17,
      transparent: true
    }

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        for (let k = -1; k < 2; k++) {
          var geometry = new THREE.BoxGeometry(1, 1, 1)
          var material = new THREE.MeshLambertMaterial(neutral)

          var cube = new THREE.Mesh(geometry, material)
          cubes.push(cube)

          cube.position.x = i * cellSize
          cube.position.y = j * cellSize
          cube.position.z = k * cellSize

          scene.add(cube)

          cubeUuids.push(cube.uuid)
        }
      }
    }

    // Create renderer.
    // //////////////////////////////////////////////////////////////////////

    var renderer = new THREE.WebGLRenderer({ canvas })

    renderer.setSize(width, height)
    renderer.setClearColor(0xeeeeee)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.sortObjects = false

    // Add lights.
    // //////////////////////////////////////////////////////////////////////

    var directionalLight0 = new THREE.DirectionalLight(0x808080)
    directionalLight0.position.x = 4
    directionalLight0.position.y = 2
    directionalLight0.position.z = 0
    directionalLight0.position.normalize()
    scene.add(directionalLight0)

    const directionalLight1 = new THREE.DirectionalLight(0x808080)
    directionalLight1.position.x = -2
    directionalLight1.position.y = 0
    directionalLight1.position.z = -4
    directionalLight1.position.normalize()
    scene.add(directionalLight1)

    const directionalLight2 = new THREE.DirectionalLight(0x808080)
    directionalLight2.position.x = 0
    directionalLight2.position.y = -4
    directionalLight2.position.z = 2
    directionalLight2.position.normalize()
    scene.add(directionalLight2)

    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)

    // Navigation controls.
    // //////////////////////////////////////////////////////////////////////

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enablePan = false
    controls.enableZoom = false

    // Init event listeners.
    // //////////////////////////////////////////////////////////////////////

    function onMouseDown (event) {
      event.preventDefault()
      event.stopPropagation()

      if (this.isPlaying) {
        const localPlayerIndex = this.localPlayerIndex
        const playerIndex = this.playerIndex
        const selectedCube = this.selectedCube

        if (selectedCube && (playerIndex === localPlayerIndex)) {
          var cubeIndex = cubeUuids.indexOf(selectedCube.uuid)
          this.setChoice(cubeIndex)
        }
      }
    }

    function onMouseMove (event) {
      // Cannot call `event.stopPropagation()`,
      // otherwise the orbit control does not work.
      event.preventDefault()

      const rect = parentElement.getBoundingClientRect()

      // Find intersected cubes.

      const x = (event.offsetX || event.clientX - rect.left)
      const y = (event.offsetY || event.clientY - rect.top)

      const vector = new THREE.Vector3(
        (x / width) * 2 - 1,
        -(y / height) * 2 + 1,
        1
      )

      vector.unproject(camera)

      const ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize())
      const intersectedCubes = ray.intersectObjects(cubes)

      // Set selected cube.

      if (intersectedCubes.length > 0) {
        this.selectedCube = intersectedCubes[0].object
      } else {
        this.selectedCube = null
      }
    }

    canvas.addEventListener('mousemove', onMouseMove.bind(this), false)
    canvas.addEventListener('mousedown', onMouseDown.bind(this), false)

    // Class attributes.
    // //////////////////////////////////////////////////////////////////////

    this.choosen = []
    this.localPlayerIndex = 0
    this.isPlaying = false
    this.playerIndex = 0
    this.selectedCube = null

    staticProps(this)({
      camera,
      canvas,
      cubes,
      cubeUuids,
      neutral,
      playerColors,
      scene,
      renderer
    })

    // Default events.
    // //////////////////////////////////////////////////////////////////////

    this.on('nextPlayer', (playerIndex) => {
      const localPlayerIndex = this.localPlayerIndex

      if (playerIndex === localPlayerIndex) {
        this.emit('localPlayerTurnStarts')
      } else {
        const previousPlayerIndex = (playerIndex + 2) % 3

        if (previousPlayerIndex === localPlayerIndex) {
          this.emit('localPlayerTurnEnds')
        }
      }
    })

    this.on('tris3d!', () => {
      this.isPlaying = false
    })

    this.on('nobodyWins', () => {
      this.isPlaying = false
    })

    function onWindowResize () {
      const rect = parentElement.getBoundingClientRect()
      const size = Math.min(rect.height, rect.width)
      const width = size
      const height = size

      camera.aspect = width / height
      camera.updateProjectionMatrix()

      renderer.setSize(width, height)
    }

    window.addEventListener('resize', onWindowResize, false)
  }

  /**
   * Improve winning combinations visibility.
   */

  highlightTris (winningCombinations) {
    var winningCubes = []

    // Get all winning cube indexes without repetitions.
    winningCombinations.forEach((winningCombination) => {
      winningCombination.forEach((winningIndex) => {
        if (winningCubes.indexOf(winningIndex) === -1) {
          winningCubes.push(winningIndex)
        }
      })
    })

    this.cubes.forEach((cube, cubeIndex) => {
      if (winningCubes.indexOf(cubeIndex) === -1) {
        cube.material.transparent = true
      }
    })
  }

  /**
   * Start rendering the 3d scene.
   */

  render () {
    const {
      camera,
      cubeUuids,
      neutral,
      renderer,
      scene
    } = this

    var previousSelectedCube = null
    var selectedCube = null

    // The main 3d loop.
    // //////////////////////////////////////////////////////////////////////

    const isNotAvaliable = (cube) => {
      var cubeIndex = cubeUuids.indexOf(cube.uuid)
      return this.choosen.indexOf(cubeIndex) !== -1
    }

    const lowlight = (cube) => {
      // Do nothing if cube is already choosen.
      if (isNotAvaliable(cube)) return

      cube.material.opacity = neutral.opacity
      cube.material.color.setHex(neutral.color)
    }

    const highlight = (cube) => {
      // Do nothing if cube is already choosen.
      if (isNotAvaliable(cube)) return

      const highlitedOpacity = 0.71
      cube.material.opacity = highlitedOpacity

      const isMyTurn = (this.localPlayerIndex === this.playerIndex)

      if (isMyTurn) {
        const color = this.playerColors[this.playerIndex]
        cube.material.color.setHex(color)
      }
    }

    const loop = () => {
      previousSelectedCube = selectedCube
      selectedCube = this.selectedCube

      // Highlight selected cube.
      if (this.isPlaying) {
        if (selectedCube) {
          if (previousSelectedCube && selectedCube.uuid !== previousSelectedCube.uuid) {
            lowlight(previousSelectedCube)
          } else {
            highlight(selectedCube)
          }
        } else {
          if (previousSelectedCube) {
            lowlight(previousSelectedCube)
          }
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

  setChoice (cubeIndex) {
    // Nothing to do if choice is already taken.
    const choiceIsNotAvailable = (this.choosen.indexOf(cubeIndex) > -1)
    if (choiceIsNotAvailable) return

    const playerIndex = this.playerIndex

    // Store player choice and notify listeners.
    const numberOfChoices = this.choosen.push(cubeIndex)
    this.emit('setChoice', cubeIndex)

    // Color choosen cube.
    const color = this.playerColors[playerIndex]
    this.cubes[cubeIndex].material.color.setHex(color)
    this.cubes[cubeIndex].material.transparent = false

    // Check if current player wins.
    // //////////////////////////////////////////////////////////////////////

    // Get player choices.
    var playerChoices = []

    for (var i = numberOfChoices - 1; i >= 0; i -= 3) {
      playerChoices.push(this.choosen[i])
    }

    // A choice can lead to more that one winning combination.
    var winningCombinations = []

    // For every combination, check if it wins.
    for (var k = 2; k < playerChoices.length; k++) {
      for (var j = 1; j < k; j++) {
        var coords0 = tris3d.coordinatesOfIndex(playerChoices[0])
        var coords1 = tris3d.coordinatesOfIndex(playerChoices[j])
        var coords2 = tris3d.coordinatesOfIndex(playerChoices[k])

        if (tris3d.isTris(coords0, coords1, coords2)) {
          winningCombinations.push([
            playerChoices[0],
            playerChoices[j],
            playerChoices[k]
          ])
        }
      }
    }

    if (winningCombinations.length === 0) {
      if (this.choosen.length === 27) {
        this.emit('nobodyWins')
      } else {
        // Next turn to play.
        this.playerIndex = (playerIndex + 1) % 3
        this.emit('nextPlayer', this.playerIndex)
      }
    } else {
      this.emit('tris3d!', playerIndex, winningCombinations)
      this.highlightTris(winningCombinations)
    }
  }

  /**
   * Reset variables and cleanup playground.
   */

  resetPlayground () {
    this.choosen = []
    this.isPlaying = false
    this.playerIndex = 0
    this.selectedCube = null

    const neutral = this.neutral

    this.cubes.forEach((cube) => {
      cube.material.opacity = neutral.opacity
      cube.material.transparent = true
      cube.material.color.setHex(neutral.color)
    })
  }

  /**
   * Reset playground and start a brand new match.
   */

  startNewMatch () {
    this.resetPlayground()
    this.isPlaying = true

    this.emit('nextPlayer', 0)
  }
}

export default Tris3dCanvas
