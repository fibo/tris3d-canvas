'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var THREE = require('three');
var staticProps = require('static-props');
var OrbitControls = require('three-orbitcontrols');

var Tris3dCanvas = function () {
  function Tris3dCanvas(id) {
    _classCallCheck(this, Tris3dCanvas);

    // Get canvas, its offset, width and height

    var canvas = document.getElementById(id);
    var offset = canvas.parentNode.getBoundingClientRect();
    var width = canvas.width;
    var height = canvas.height;

    var cellSize = 1.7;

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 7.1;

    var rayCaster = new THREE.Raycaster();
    // Initialize pointer with coordinates outside of the screen,
    // otherwise the center cube will result as selected on start.
    var pointer = new THREE.Vector2(10, 10);

    // Create 3x3x3 cubes

    var cubes = [];

    var neutral = {
      color: 0x00bb11,
      opacity: 0.17,
      transparent: true
    };

    for (var i = -1; i < 2; i++) {
      for (var j = -1; j < 2; j++) {
        for (var k = -1; k < 2; k++) {
          var geometry = new THREE.BoxGeometry(1, 1, 1);
          var material = new THREE.MeshBasicMaterial(neutral);

          var cube = new THREE.Mesh(geometry, material);
          cubes.push(cube);

          cube.position.x = i * cellSize;
          cube.position.y = j * cellSize;
          cube.position.z = k * cellSize;

          scene.add(cube);
        }
      }
    }

    // Create renderer.

    var renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(width, height);
    renderer.setClearColor(0xeeeeee);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.sortObjects = false;

    // Navigation controls.

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;

    // Init event listeners.

    function onMouseMove(event) {
      event.preventDefault();
      event.stopPropagation();

      var x = event.clientX - offset.left;
      var y = event.clientY - offset.top;

      pointer.x = x / canvas.width * 2 - 1;
      pointer.y = -(y / canvas.height) * 2 + 1;
    }

    canvas.addEventListener('mousemove', onMouseMove, false);

    function onResize() {
      camera.aspect = canvas.width / canvas.height;
      camera.updateProjectionMatrix();

      renderer.setSize(canvas.width, canvas.height);
    }

    canvas.addEventListener('resize', onResize, false);

    // Finally, add attributes.

    staticProps(this)({
      camera: camera,
      canvas: canvas,
      cubes: cubes,
      pointer: pointer,
      scene: scene,
      rayCaster: rayCaster,
      renderer: renderer
    });
  }

  _createClass(Tris3dCanvas, [{
    key: 'render',
    value: function render() {
      var camera = this.camera;
      var cubes = this.cubes;
      var pointer = this.pointer;
      var rayCaster = this.rayCaster;
      var renderer = this.renderer;
      var scene = this.scene;

      // TODO needed to rotate the camera
      // let theta = 0

      var selectedCube = null;

      function loop() {
        // TODO The code below is works and can be used to rotate the camera
        //      when the game is over.
        // theta += 0.1
        // camera.position.x = 10 * Math.sin(THREE.Math.degToRad(theta))
        // camera.position.y = 10 * Math.sin(THREE.Math.degToRad(theta))
        // camera.position.z = 10 * Math.cos(THREE.Math.degToRad(theta))
        // camera.lookAt(scene.position)
        // camera.updateMatrixWorld()

        // Find intersected objects.

        rayCaster.setFromCamera(pointer, camera);
        var intersects = rayCaster.intersectObjects(cubes);

        if (intersects.length > 0) {
          if (selectedCube !== intersects[0].object) {
            if (selectedCube) selectedCube.material.opacity = 0.17;

            selectedCube = intersects[0].object;
            selectedCube.material.opacity = 0.71;
          }
        } else {
          if (selectedCube) selectedCube.material.opacity = 0.17;
          selectedCube = null;
        }

        renderer.render(scene, camera);

        window.requestAnimationFrame(loop);
      }

      loop(); // oh yeah!
    }
  }]);

  return Tris3dCanvas;
}();

exports.default = Tris3dCanvas;
