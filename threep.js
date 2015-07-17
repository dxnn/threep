// TODO: proper module / constructor etc

// TODO: build N layers dynamically
var NL = 9   // number of layers
var BW = 40  // base width
var BH = 40  // base height

var data = [] // TODO: package point database seperately

function add_point(x, y, z) {
  data.push([x, y, z])
  // TODO: add indices, etc
}

function remove_point(x, y, z) {
  // TODO
}

function select_points(fun) {
  return fun(data)
  // TODO: make this more better
}

function xselector(min_x, max_x) {
  return selector(min_x, max_x, null, null, null, null)
}

function yselector(min_y, max_y) {
  return selector(null, null, min_y, max_y, null, null)
}

function zselector(min_z, max_z) {
  return selector(null, null, null, null, min_z, max_z)
}

function selector(lx, hx, ly, hy, lz, hz) {
  return function(data) {
    var acc = []

    for(var i = 0; i < data.length; i++) {
      var d = data[i]
      var x = d[0]
      var y = d[1]
      var z = d[2]

      if(lx !== null && (lx > x || hx < x)) continue;
      if(ly !== null && (ly > y || hy < y)) continue;
      if(lz !== null && (lz > z || hz < z)) continue;

      acc.push(d)
    }

    return acc
  }
}

// RENDERER

function str_for_layer(n) {
  var data = select_points(zselector(n-1, n))
  var size = layer_size(n)
  var list = empty_list(size)
  for(var i = 0; i < data.length; i++) {
    var index = (size[0]+1) * data[i][1] + data[i][0]
    list[index] = '.'
  }
  return strcat(list)
}

function strcat(list) {
  var str = ""
  for(var i = 0; i < list.length; i++) 
    str += list[i]
  return str
}

function empty_list(size) {
  var w = size[0]
  var h = size[1]
  var list = []
  for(var i = 1; i <= (w+1)*h; i++)
    list.push( i % (w+1) ? " " : "\n" )
  return list
}

function layer_size(n) {
  return [BW+n, BH+n] // HERP DERP
}

function render_layer(n) {
  layer_els[n].textContent = str_for_layer(n)
}

var layer_els = []
var el = document.getElementById.bind(document)


function init() {
  for(var i = 0; i < NL; i++) {
    var layer = el('layer_'+(i+1))
    layer_els[i] = layer
    layer.style.fontSize = (NL+8-i) + 'px'
  }

  for(x = 10; x < 30; x++) {
    for(y = 15; y < 25; y++) {
      for(z = 0; z < 10; z++) {
        add_point(x, y, z)
        // add_point(x, y, 3)
        // add_point(x, y+10, 2)
      }
    }
  }
}

document.onreadystatechange = function() {
  init()
  for(var i = 0; i < NL; i++) {
    render_layer(i)
  }
}
