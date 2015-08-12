// TODO: proper module / constructor etc

// TODO: build N layers dynamically
var NL = 30   // number of layers
var BW = 300  // base width
var BH = 300  // base height

var VS = [ [0,0,0], [200,0,0], [100,200,0], [100,100,  NL-1  ] ]
// var VS = [ [0,0,0], [200,0,0], [0,200,0], [300,200,0]]

var db = [] // TODO: package point database seperately

function add_point(x, y, z) {
  db.push([x, y, z])
  // TODO: add indices, etc
}

function remove_point(x, y, z) {
  // TODO
}

function clear_points() {
  db = []
}

function select_points(fun) {
  return fun(db)
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
      var d = data[i] // TODO: destructing
      var x = d[0]
      var y = d[1]
      var z = d[2]

      if(lx !== null && (lx > x || hx <= x)) continue
      if(ly !== null && (ly > y || hy <= y)) continue
      if(lz !== null && (lz > z || hz <= z)) continue

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
    var index = Math.floor((size[0]+1) * Math.floor(data[i][1]) + data[i][0])
    // if(list[index] == '.') console.error('repeat')
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

function render_layers() {
  for(var i = 0; i < NL; i++) {
    render_layer(i)
  }
}

function skew_layers(l, t) {
  for(var i = 0; i < NL; i++) {
    var layer = layer_els[i]
    layer.style.top  = i * (t / (NL+1)) + 'px'
    layer.style.left = i * (l / (NL+1)) + 'px'
  }
}

function init() {
  make_layers(NL)
}

var layer_els = []
var el = document.getElementById.bind(document)

function make_layers(n) {
  var canvas = el('canvas')
  for(var i = 0; i < NL; i++) {
    var pre = document.createElement('pre')
    pre.id = 'layer_'+(i+1)
    canvas.appendChild(pre)
    layer_els[i] = pre
  }
}

function chaos(vs) {
  var point = [100, 100, 0]

  for(var i = 0; i < 300000; i++) {
    add(point)
    point = halfway(point, rand(vs))
  }

  function add(p) {
    add_point(p[0], p[1], p[2])
  }

  function halfway(p1, p2) {
    return [ (p1[0]+p2[0])/2, (p1[1]+p2[1])/2, (p1[2]+p2[2])/2 ]
  }

  function rand(list) {
    return list[Math.floor(Math.random() * list.length)]
  }
}

document.addEventListener('DOMContentLoaded', function() {
  init()

  chaos(VS)

  render_layers()


  el('body').addEventListener('mousemove', function(e) {
    onmove(e.clientX, e.clientY)
  })
})

var mousemode = 'skew'

function onmove(x, y) {
  if(mousemode == 'skew') {
    skew_layers(x, y)
  } else if(mousemode == 'drag') {
    console.log('drag')
  }
}



// var layer = el('layer_'+(i+1))
// layer_els[i] = layer
// layer.style.top  = i + 'px'
// layer.style.left = i + 'px'
// layer.style.fontSize = (NL+8-i) + 'px'






// z = 1

// for(x = 10; x < 30; x++) {
//   for(y = 15; y < 25; y++) {
//     // for(z = 0; z < 10; z++) {
//       add_point(x, y, z)
//       // add_point(x, y, 3)
//       // add_point(x, y+10, 2)
//     // }
//   }
// }
