var fs = require('fs')
var path = require('path')

function changeColor (id) {
  document.getElementById(id).setAttribute('diffuseColor', '0 0 1')
}

var component = fs.readFileSync(path.join(__dirname, 'component.html'), 'utf8')

exports.component = component
