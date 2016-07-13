(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _tris3dCanvas = require('tris3d-canvas');

var _tris3dCanvas2 = _interopRequireDefault(_tris3dCanvas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tris3d = new _tris3dCanvas2.default('demo');

tris3d.render();

},{"tris3d-canvas":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tris3dCanvas = function () {
  function Tris3dCanvas(id) {
    _classCallCheck(this, Tris3dCanvas);

    var canvas = document.getElementById(id);

    var gl = null;

    try {
      // Try to grab the standard context. If it fails, fallback to experimental.
      gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch (ignore) {}

    // Only continue if WebGL is available and working
    if (gl) {
      this.gl = gl;

      // Set clear color to black, fully opaque.
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      // Enable depth testing
      gl.enable(gl.DEPTH_TEST);
      // Near things obscure far things.
      gl.depthFunc(gl.LEQUAL);
      // Clear the color as well as the depth buffer.
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      // Set the viewport.
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }

  _createClass(Tris3dCanvas, [{
    key: 'render',
    value: function render() {
      console.log(this.gl);
    }
  }]);

  return Tris3dCanvas;
}();

exports.default = Tris3dCanvas;

},{}]},{},[1]);
