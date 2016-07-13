import glShader from 'gl-shader'
import glslify from 'glslify'

class Tris3dCanvas {
  constructor (id) {
    const canvas = document.getElementById(id)

    let gl = null

    try {
      // Try to grab the standard context. If it fails, fallback to experimental.
      gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    } catch (ignore) {}

    // Only continue if WebGL is available and working
    if (gl) {
      this.gl = gl

      // Set clear color to black, fully opaque.
      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      // Enable depth testing
      gl.enable(gl.DEPTH_TEST)
      // Near things obscure far things.
      gl.depthFunc(gl.LEQUAL)
      // Clear the color as well as the depth buffer.
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      // Set the viewport.
      gl.viewport(0, 0, canvas.width, canvas.height)

      var shader = glShader(gl,
        glslify('./fragment.glsl'),
        glslify('./vertex.glsl')
      )
    }
  }
  render () {
    console.log(this.gl)
  }
}

export default Tris3dCanvas
