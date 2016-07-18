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
    // Initialize pointer with coordinates outside of the screen,
    // otherwise the center cube will result as selected on start.
    const pointer = new THREE.Vector2(10, 10)

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

    // Create renderer.

    const renderer = new THREE.WebGLRenderer({ canvas })
    renderer.setSize(width, height)
    renderer.setClearColor(0xeeeeee)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.sortObjects = false

    // Navigation controls.

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = false

    // Init event listeners.

    function onMouseMove (event) {
      event.preventDefault()

      pointer.x = (event.clientX / canvas.width) * 2 - 1
      pointer.y = -(event.clientY / canvas.height) * 2 + 1
    }

    canvas.addEventListener('mousemove', onMouseMove, false)

    function onResize () {
      camera.aspect = canvas.width / canvas.height
      camera.updateProjectionMatrix()

      renderer.setSize(canvas.width, canvas.height)
    }

    canvas.addEventListener('resize', onResize, false)

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

  render () {
    const {
      camera,
      cubes,
      pointer,
      rayCaster,
      renderer,
      scene
    } = this

    // TODO needed to rotate the camera
    // let theta = 0
    let selectedCube = null

    function loop () {
      // TODO The code below is works and can be used to rotate the camera
      //      when the game is over.
      // theta += 0.1
      // camera.position.x = 10 * Math.sin(THREE.Math.degToRad(theta))
      // camera.position.y = 10 * Math.sin(THREE.Math.degToRad(theta))
      // camera.position.z = 10 * Math.cos(THREE.Math.degToRad(theta))
      // camera.lookAt(scene.position)
      // camera.updateMatrixWorld()

      // Find intersected objects.

      rayCaster.setFromCamera(pointer, camera)
      const intersects = rayCaster.intersectObjects(cubes)

      if (intersects.length > 0) {
        if (selectedCube !== intersects[0].object) {
          if (selectedCube) selectedCube.material.opacity = 0.17

          selectedCube = intersects[0].object
          selectedCube.material.opacity = 0.71
        }
      } else {
        if (selectedCube) selectedCube.material.opacity = 0.17
        selectedCube = null
      }

      renderer.render(scene, camera)

      window.requestAnimationFrame(loop)
    }

    loop() // oh yeah!
  }
}

export default Tris3dCanvas
