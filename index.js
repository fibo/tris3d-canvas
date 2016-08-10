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
  /**
   * Create a tris3d canvas
   *
   * @param {String} id of canvas element
   *
   * @constructor
   */

  function Tris3dCanvas(id) {
    _classCallCheck(this, Tris3dCanvas);

    // Get canvas, its offset, width and height.
    // //////////////////////////////////////////////////////////////////////

    var canvas = document.getElementById(id);
    var offsetLeft = canvas.offsetLeft;
    var offsetTop = canvas.offsetTop;
    var width = canvas.width;
    var height = canvas.height;

    var cellSize = 1.7;

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 7.1;

    // Create 3x3x3 cubes.
    // //////////////////////////////////////////////////////////////////////

    // The 3d cubes array.
    var cubes = [];

    // Remember (mesh cube) <--> (cell) association, using cube uuids.
    var cellUuids = [];

    // Default material.
    var neutral = {
      color: 0x000000,
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

          cellUuids.push(cube.uuid);
        }
      }
    }

    // Create renderer.
    // //////////////////////////////////////////////////////////////////////

    var renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(width, height);
    renderer.setClearColor(0xeeeeee);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.sortObjects = false;

    // Navigation controls.
    // //////////////////////////////////////////////////////////////////////

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;

    // Init event listeners.
    // //////////////////////////////////////////////////////////////////////

    function onMouseDown(event) {
      event.preventDefault();

      if (this.isPlaying) {
        var currentPlayerIndex = this.currentPlayerIndex;
        var playerIndex = this.playerIndex;
        var selectedCube = this.selectedCube;

        if (selectedCube && playerIndex === currentPlayerIndex) {
          var cubeIndex = cellUuids.indexOf(selectedCube.uuid);
          this.setChoice(playerIndex, cubeIndex);
        }
      }
    }

    function onMouseMove(event) {
      event.preventDefault();
      // Cannot call `event.stopPropagation()`,
      // otherwise the orbit control does not work.

      // Find intersected cubes.

      var x = event.offsetX || event.clientX - offsetLeft;
      var y = event.offsetY || event.clientY - offsetTop;

      var vector = new THREE.Vector3(x / width * 2 - 1, -(y / height) * 2 + 1, 1);

      vector.unproject(camera);

      var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
      var intersectedCubes = ray.intersectObjects(cubes);

      if (intersectedCubes.length > 0) {
        this.selectedCube = intersectedCubes[0].object;
      } else {
        this.selectedCube = null;
      }
    }

    canvas.addEventListener('mousemove', onMouseMove.bind(this), false);
    canvas.addEventListener('mousedown', onMouseDown.bind(this), false);

    // Finally, add attributes.
    // //////////////////////////////////////////////////////////////////////

    this.choices = [];
    this.currentPlayerIndex = 0;
    this.isPlaying = true;
    this.playerIndex = 0;
    this.selectedCube = null;

    var playerColors = [0xff0000, 0x00ff00, 0x0000ff];

    staticProps(this)({
      camera: camera,
      canvas: canvas,
      cubes: cubes,
      playerColors: playerColors,
      scene: scene,
      renderer: renderer
    });
  }

  /**
   * Start rendering the 3d scene.
   */

  _createClass(Tris3dCanvas, [{
    key: 'render',
    value: function render() {
      var self = this;

      var camera = this.camera;
      var renderer = this.renderer;
      var scene = this.scene;


      var previousSelectedCube = null;
      var selectedCube = null;

      // The main 3d loop.
      // //////////////////////////////////////////////////////////////////////

      function loop() {
        previousSelectedCube = selectedCube;
        selectedCube = self.selectedCube;

        if (selectedCube) {
          if (previousSelectedCube && selectedCube.uuid !== previousSelectedCube.uuid) {
            previousSelectedCube.material.opacity = 0.17;
          } else {
            selectedCube.material.opacity = 0.71;
          }
        } else {
          if (previousSelectedCube) {
            previousSelectedCube.material.opacity = 0.17;
          }
        }

        renderer.render(scene, camera);

        window.requestAnimationFrame(loop);
      }

      loop(); // Oh yeah!
    }

    /**
     * Set player choice.
     */

  }, {
    key: 'setChoice',
    value: function setChoice(playerIndex, cubeIndex) {
      // Store player choice.
      this.choices.push(cubeIndex);

      var playerIndex = this.playerIndex;

      // Set chosen cube color.
      var color = this.playerColors[playerIndex];
      this.cubes[cubeIndex].material.color.setHex(color);

      // Next turn to play.
      this.playerIndex = (playerIndex + 1) % 3;
    }
  }]);

  return Tris3dCanvas;
}();

exports.default = Tris3dCanvas;
