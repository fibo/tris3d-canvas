'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bindme = require('bindme');
var EventEmitter = require('events');
var OrbitControls = require('three-orbitcontrols');
var staticProps = require('static-props');
var THREE = require('three');
var tris3d = require('tris3d');

var Tris3dCanvas = function (_EventEmitter) {
  _inherits(Tris3dCanvas, _EventEmitter);

  /**
   * Create a tris3d canvas
   *
   * @param {String} id of canvas element
   * @param {Object} [opt]
   * @param {Array} [opt.playerColors] are three colors, like 0xff0000
   *
   * @constructor
   */

  function Tris3dCanvas(id) {
    var _this;

    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Tris3dCanvas);

    bindme((_this = _possibleConstructorReturn(this, (Tris3dCanvas.__proto__ || Object.getPrototypeOf(Tris3dCanvas)).call(this)), _this), 'onMousedown', 'onMousemove', 'resize');

    var defaultPlayerColors = [0xff0000, 0x00ff00, 0x0000ff];

    var playerColors = opt.playerColors || defaultPlayerColors;

    // Get canvas, its offset, width and height.
    // //////////////////////////////////////////////////////////////////////

    var canvas = document.getElementById(id);

    // Make canvas responsive by fill its parent.
    var rect = canvas.parentElement.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height);
    var width = size;
    var height = size;

    var style = 'margin:0; padding:0; width: 100%; height: auto;';
    canvas.setAttribute('style', style);

    var cellSize = 1.7;

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 7.1;

    // Create 3x3x3 cubes.
    // //////////////////////////////////////////////////////////////////////

    // The 3d cubes array.
    var cubes = [];

    // Remember (mesh cube) <--> (cell) association, using cube uuids.
    var cubeUuids = [];

    // Default materials.
    var neutral = {
      color: 0x000000,
      opacity: 0.17,
      transparent: true
    };

    for (var i = -1; i < 2; i++) {
      for (var j = -1; j < 2; j++) {
        for (var k = -1; k < 2; k++) {
          var geometry = new THREE.BoxGeometry(1, 1, 1);
          var material = new THREE.MeshLambertMaterial(neutral);

          var cube = new THREE.Mesh(geometry, material);
          cubes.push(cube);

          cube.position.x = i * cellSize;
          cube.position.y = j * cellSize;
          cube.position.z = k * cellSize;

          scene.add(cube);

          cubeUuids.push(cube.uuid);
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

    // Add lights.
    // //////////////////////////////////////////////////////////////////////

    var directionalLight0 = new THREE.DirectionalLight(0x808080);
    directionalLight0.position.x = 4;
    directionalLight0.position.y = 2;
    directionalLight0.position.z = 0;
    directionalLight0.position.normalize();
    scene.add(directionalLight0);

    var directionalLight1 = new THREE.DirectionalLight(0x808080);
    directionalLight1.position.x = -2;
    directionalLight1.position.y = 0;
    directionalLight1.position.z = -4;
    directionalLight1.position.normalize();
    scene.add(directionalLight1);

    var directionalLight2 = new THREE.DirectionalLight(0x808080);
    directionalLight2.position.x = 0;
    directionalLight2.position.y = -4;
    directionalLight2.position.z = 2;
    directionalLight2.position.normalize();
    scene.add(directionalLight2);

    var ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Navigation controls.
    // //////////////////////////////////////////////////////////////////////

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enablePan = false;
    controls.enableZoom = false;

    // Init event listeners.
    // //////////////////////////////////////////////////////////////////////

    canvas.addEventListener('mousemove', _this.onMousemove, false);
    canvas.addEventListener('mousedown', _this.onMousedown, false);

    // Class attributes.
    // //////////////////////////////////////////////////////////////////////

    _this.choosen = [];
    _this.localPlayerIndex = 0;
    _this.isPlaying = false;
    _this.playerIndex = 0;
    _this.selectedCube = null;

    staticProps(_this)({
      camera: camera,
      canvas: canvas,
      cubes: cubes,
      cubeUuids: cubeUuids,
      neutral: neutral,
      playerColors: playerColors,
      scene: scene,
      renderer: renderer
    });

    // Default events.
    // //////////////////////////////////////////////////////////////////////

    _this.on('nextPlayer', function (playerIndex) {
      var localPlayerIndex = _this.localPlayerIndex;

      if (playerIndex === localPlayerIndex) {
        _this.emit('localPlayerTurnStarts');
      } else {
        var previousPlayerIndex = (playerIndex + 2) % 3;

        if (previousPlayerIndex === localPlayerIndex) {
          _this.emit('localPlayerTurnEnds');
        }
      }
    });

    _this.on('tris3d!', function () {
      _this.isPlaying = false;
    });

    _this.on('nobodyWins', function () {
      _this.isPlaying = false;
    });

    window.addEventListener('resize', _this.resize, false);
    return _this;
  }

  _createClass(Tris3dCanvas, [{
    key: 'getBoundingClientRect',
    value: function getBoundingClientRect() {
      return this.canvas.parentElement.getBoundingClientRect();
    }

    /**
     * Improve winning combinations visibility.
     */

  }, {
    key: 'highlightTris',
    value: function highlightTris(winningCombinations) {
      var winningCubes = [];

      // Get all winning cube indexes without repetitions.
      winningCombinations.forEach(function (winningCombination) {
        winningCombination.forEach(function (winningIndex) {
          if (winningCubes.indexOf(winningIndex) === -1) {
            winningCubes.push(winningIndex);
          }
        });
      });

      this.cubes.forEach(function (cube, cubeIndex) {
        if (winningCubes.indexOf(cubeIndex) === -1) {
          cube.material.transparent = true;
        }
      });
    }
  }, {
    key: 'onMousedown',
    value: function onMousedown(event) {
      event.preventDefault();
      event.stopPropagation();

      var cubeUuids = this.cubeUuids,
          localPlayerIndex = this.localPlayerIndex,
          isPlaying = this.isPlaying,
          playerIndex = this.playerIndex,
          selectedCube = this.selectedCube;


      if (isPlaying) {
        if (selectedCube && playerIndex === localPlayerIndex) {
          var cubeIndex = cubeUuids.indexOf(selectedCube.uuid);
          this.setChoice(cubeIndex);
        }
      }
    }
  }, {
    key: 'onMousemove',
    value: function onMousemove(event) {
      // Cannot call `event.stopPropagation()`,
      // otherwise the orbit control does not work.
      event.preventDefault();

      var camera = this.camera,
          cubes = this.cubes;


      var rect = this.getBoundingClientRect();

      // Find intersected cubes.

      var x = event.offsetX || event.clientX - rect.left;
      var y = event.offsetY || event.clientY - rect.top;

      var vector = new THREE.Vector3(x / rect.width * 2 - 1, -(y / rect.height) * 2 + 1, 1);

      vector.unproject(camera);

      var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
      var intersectedCubes = ray.intersectObjects(cubes);

      // Set selected cube.

      if (intersectedCubes.length > 0) {
        this.selectedCube = intersectedCubes[0].object;
      } else {
        this.selectedCube = null;
      }
    }

    /**
     * Start rendering the 3d scene.
     */

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var camera = this.camera,
          cubeUuids = this.cubeUuids,
          neutral = this.neutral,
          renderer = this.renderer,
          scene = this.scene;


      var previousSelectedCube = null;
      var selectedCube = null;

      // The main 3d loop.
      // //////////////////////////////////////////////////////////////////////

      var isNotAvaliable = function isNotAvaliable(cube) {
        var cubeIndex = cubeUuids.indexOf(cube.uuid);
        return _this2.choosen.indexOf(cubeIndex) !== -1;
      };

      var lowlight = function lowlight(cube) {
        // Do nothing if cube is already choosen.
        if (isNotAvaliable(cube)) return;

        cube.material.opacity = neutral.opacity;
        cube.material.color.setHex(neutral.color);
      };

      var highlight = function highlight(cube) {
        // Do nothing if cube is already choosen.
        if (isNotAvaliable(cube)) return;

        var highlitedOpacity = 0.71;
        cube.material.opacity = highlitedOpacity;

        var isMyTurn = _this2.localPlayerIndex === _this2.playerIndex;

        if (isMyTurn) {
          var color = _this2.playerColors[_this2.playerIndex];
          cube.material.color.setHex(color);
        }
      };

      var loop = function loop() {
        previousSelectedCube = selectedCube;
        selectedCube = _this2.selectedCube;

        // Highlight selected cube.
        if (_this2.isPlaying) {
          if (selectedCube) {
            if (previousSelectedCube && selectedCube.uuid !== previousSelectedCube.uuid) {
              lowlight(previousSelectedCube);
            } else {
              highlight(selectedCube);
            }
          } else {
            if (previousSelectedCube) {
              lowlight(previousSelectedCube);
            }
          }
        }

        renderer.render(scene, camera);

        window.requestAnimationFrame(loop);
      };

      loop(); // Oh yeah!
    }

    /**
     * Trigger window resize.
     */

  }, {
    key: 'resize',
    value: function resize() {
      var camera = this.camera,
          canvas = this.canvas,
          renderer = this.renderer;


      var rect = this.getBoundingClientRect();
      var size = Math.min(rect.height, rect.width);
      var width = size;
      var height = size;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    }

    /**
     * Set player choice.
     */

  }, {
    key: 'setChoice',
    value: function setChoice(cubeIndex) {
      // Nothing to do if choice is already taken.
      var choiceIsNotAvailable = this.choosen.indexOf(cubeIndex) > -1;
      if (choiceIsNotAvailable) return;

      var playerIndex = this.playerIndex;

      // Store player choice and notify listeners.
      var numberOfChoices = this.choosen.push(cubeIndex);
      this.emit('setChoice', cubeIndex);

      // Color choosen cube.
      var color = this.playerColors[playerIndex];
      this.cubes[cubeIndex].material.color.setHex(color);
      this.cubes[cubeIndex].material.transparent = false;

      // Check if current player wins.
      // //////////////////////////////////////////////////////////////////////

      // Get player choices.
      var playerChoices = [];

      for (var i = numberOfChoices - 1; i >= 0; i -= 3) {
        playerChoices.push(this.choosen[i]);
      }

      // A choice can lead to more that one winning combination.
      var winningCombinations = [];

      // For every combination, check if it wins.
      for (var k = 2; k < playerChoices.length; k++) {
        for (var j = 1; j < k; j++) {
          var coords0 = tris3d.coordinatesOfIndex(playerChoices[0]);
          var coords1 = tris3d.coordinatesOfIndex(playerChoices[j]);
          var coords2 = tris3d.coordinatesOfIndex(playerChoices[k]);

          if (tris3d.isTris(coords0, coords1, coords2)) {
            winningCombinations.push([playerChoices[0], playerChoices[j], playerChoices[k]]);
          }
        }
      }

      if (winningCombinations.length === 0) {
        if (this.choosen.length === 27) {
          this.emit('nobodyWins');
        } else {
          // Next turn to play.
          this.playerIndex = (playerIndex + 1) % 3;
          this.emit('nextPlayer', this.playerIndex);
        }
      } else {
        this.emit('tris3d!', playerIndex, winningCombinations);
        this.highlightTris(winningCombinations);
      }
    }

    /**
     * Reset variables and cleanup playground.
     */

  }, {
    key: 'resetPlayground',
    value: function resetPlayground() {
      this.choosen = [];
      this.isPlaying = false;
      this.playerIndex = 0;
      this.selectedCube = null;

      var neutral = this.neutral;

      this.cubes.forEach(function (cube) {
        cube.material.opacity = neutral.opacity;
        cube.material.transparent = true;
        cube.material.color.setHex(neutral.color);
      });
    }

    /**
     * Reset playground and start a brand new match.
     */

  }, {
    key: 'startNewMatch',
    value: function startNewMatch() {
      this.resetPlayground();
      this.isPlaying = true;

      this.emit('nextPlayer', 0);
    }
  }]);

  return Tris3dCanvas;
}(EventEmitter);

exports.default = Tris3dCanvas;
