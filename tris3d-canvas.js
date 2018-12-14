const bindme = require('bindme')
const OrbitControls = require('three-orbitcontrols')
const staticProps = require('static-props')
const THREE = require('three')
const tris3d = require('tris3d')

// mrdoob's threejs stats
const stats = Stats ? new Stats() : null

if (stats) {
  stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom)
}

class Tris3dCanvas {
  /**
   * Create a tris3d canvas
   *
   * @param {String} id of canvas element
   * @param {Object} [opt] optional parameters
   * @param {Array} [opt.playerColors] are three colors, like 0xff0000
   * @param {Array} [opt.backgroundColor] defaults to 0xffffff
   *
   * @constructor
   */

  constructor (id, opt = {}) {
    bindme(this,
      'onMousedown',
      'onMousemove',
      'resize'
    )

    const defaultBackgroundColor = 0xefefef
    const defaultPlayerColors = [
      0xDC143C,
      0x20B2AA,
      0x2F4F4F
    ]

    const backgroundColor = opt.backgroundColor || defaultBackgroundColor
    let playerColors = opt.playerColors || defaultPlayerColors

    // Get canvas, its offset, width and height.
    // //////////////////////////////////////////////////////////////////////

    const canvas = document.getElementById(id)

    // Make canvas responsive by fill its parent.
    const rect = canvas.parentElement.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const width = size
    const height = size

    const style = 'margin:0; padding:0; width: 100%; height: auto;'
    canvas.setAttribute('style', style)

    const cellSize = 1.7

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 7.1

    // Create 3x3x3 cubes.
    // //////////////////////////////////////////////////////////////////////

    // The 3d cubes array.
    const cubes = []

    // Remember (mesh cube) <--> (cell) association, using cube uuids.
    const cubeUuids = []

    // Default materials.
    const neutral = {
      color: 0x333333,
      opacity: 0.17,
      transparent: true
    }

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        for (let k = -1; k < 2; k++) {
          const geometry = new THREE.BoxGeometry(0.917, 0.917, 0.917)
          const material = new THREE.MeshLambertMaterial(neutral)

          const cube = new THREE.Mesh(geometry, material)
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

    const renderer = new THREE.WebGLRenderer({ canvas })

    renderer.setSize(width, height)
    renderer.setClearColor(backgroundColor)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.sortObjects = false

    // Add lights.
    // //////////////////////////////////////////////////////////////////////

    const directionalLight0 = new THREE.DirectionalLight(0xe7feff)
    directionalLight0.position.x = 6
    directionalLight0.position.y = -4
    directionalLight0.position.z = 0
    directionalLight0.position.normalize()
    scene.add(directionalLight0)

    const directionalLight1 = new THREE.DirectionalLight(0xe7feff)
    directionalLight1.position.x = -3
    directionalLight1.position.y = 0
    directionalLight1.position.z = 5
    directionalLight1.position.normalize()
    scene.add(directionalLight1)

    const directionalLight2 = new THREE.DirectionalLight(0xe7feff)
    directionalLight2.position.x = 0
    directionalLight2.position.y = 9
    directionalLight2.position.z = -5
    directionalLight2.position.normalize()
    scene.add(directionalLight2)

    const directionalLight3 = new THREE.DirectionalLight(0xe7feff)
    directionalLight3.position.x = -2
    directionalLight3.position.y = 4
    directionalLight3.position.z = 0
    directionalLight3.position.normalize()
    scene.add(directionalLight3)

    const directionalLight4 = new THREE.DirectionalLight(0xe7feff)
    directionalLight4.position.x = 3
    directionalLight4.position.y = 0
    directionalLight4.position.z = -2
    directionalLight4.position.normalize()
    scene.add(directionalLight4)

    const directionalLight5 = new THREE.DirectionalLight(0xe7feff)
    directionalLight5.position.x = 0
    directionalLight5.position.y = -7
    directionalLight5.position.z = 1
    directionalLight5.position.normalize()
    scene.add(directionalLight5)

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

    canvas.addEventListener('mousemove', this.onMousemove, false)
    canvas.addEventListener('mousedown', this.onMousedown, false)

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

    window.addEventListener('resize', this.resize, false)
  }

  emit (eventType, eventDetail) {
    const event = new CustomEvent(eventType, { detail: eventDetail })

    this.canvas.dispatchEvent(event)
  }

  getBoundingClientRect () {
    return this.canvas.parentElement.getBoundingClientRect()
  }

  /**
   * Improve winning combinations visibility.
   */

  highlightTris (winningCombinations) {
    let winningCubes = []

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

  on (eventType, eventListener) {
    this.canvas.addEventListener(eventType, event => eventListener(event.detail))
  }

  onMousedown (event) {
    event.preventDefault()
    event.stopPropagation()

    const {
      cubeUuids,
      localPlayerIndex,
      isPlaying,
      playerIndex,
      selectedCube
    } = this

    if (isPlaying) {
      if (selectedCube && (playerIndex === localPlayerIndex)) {
        const cubeIndex = cubeUuids.indexOf(selectedCube.uuid)
        this.setChoice(cubeIndex)
      }
    }
  }

  onMousemove (event) {
    // Cannot call `event.stopPropagation()`,
    // otherwise the orbit control does not work.
    event.preventDefault()

    const {
      camera,
      cubes
    } = this

    const rect = this.getBoundingClientRect()

    // Find intersected cubes.

    const x = (event.offsetX || event.clientX - rect.left)
    const y = (event.offsetY || event.clientY - rect.top)

    const vector = new THREE.Vector3(
      (x / rect.width) * 2 - 1,
      -(y / rect.height) * 2 + 1,
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

    let previousSelectedCube = null
    let selectedCube = null

    // The main 3d loop.
    // //////////////////////////////////////////////////////////////////////

    const isNotAvaliable = (cube) => {
      const cubeIndex = cubeUuids.indexOf(cube.uuid)
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
      if (stats) {
        stats.begin()
      }

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

      if (stats) {
        stats.end()
      }

      window.requestAnimationFrame(loop)
    }

    loop() // Oh yeah!
  }

  /**
   * Trigger window resize.
   */

  resize () {
    const {
      camera,
      renderer
    } = this

    const rect = this.getBoundingClientRect()
    const size = Math.min(rect.height, rect.width)
    const width = size
    const height = size

    camera.aspect = width / height
    camera.updateProjectionMatrix()

    renderer.setSize(width, height)
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
    let playerChoices = []

    for (let i = numberOfChoices - 1; i >= 0; i -= 3) {
      playerChoices.push(this.choosen[i])
    }

    // A choice can lead to more that one winning combination.
    let winningCombinations = []

    // For every combination, check if it wins.
    for (let k = 2; k < playerChoices.length; k++) {
      for (let j = 1; j < k; j++) {
        const coords0 = tris3d.coordinatesOfIndex(playerChoices[0])
        const coords1 = tris3d.coordinatesOfIndex(playerChoices[j])
        const coords2 = tris3d.coordinatesOfIndex(playerChoices[k])

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

module.exports = exports.default = Tris3dCanvas
