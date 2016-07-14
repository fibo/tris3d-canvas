import THREE from 'three'
import staticProps from 'static-props'

class Tris3dCanvas {
  constructor (id) {
    console.log(arguments)
    var canvas = document.getElementById(id)
      console.log(canvas)

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
//    document.body.appendChild(renderer.domElement)

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
