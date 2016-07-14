import THREE from 'three'
import staticProps from 'static-props'
import OrbitControls from 'three-orbitcontrols'

class Tris3dCanvas {
  constructor (id) {
    var canvas = document.getElementById(id)

    var width = canvas.width
    var height = canvas.height

    var scene = new THREE.Scene()

    var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 5

    var geometry = new THREE.BoxGeometry(1, 1, 1)
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })

    var cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    var renderer = new THREE.WebGLRenderer({ canvas })
    renderer.setSize(width, height)

    var controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = false

    staticProps(this)({ scene, camera, renderer })
  }

  render () {
    const renderer = this.renderer
    const scene = this.scene
    const camera = this.camera

    function loop () {
      window.requestAnimationFrame(loop)
      renderer.render(scene, camera)
    }

    loop() // oh yeah!
  }
}

export default Tris3dCanvas
