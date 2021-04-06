import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {spline, cSpline, toVector3, fromVector3, getSurface, mirrorPoint, mirrorPointFromCurve, cLoftSurface, bezierCurve} from './utils/maths.js'
import * as THREE from 'three'

let controlPoints = [
  new THREE.Vector3( -3, -2 ),
  new THREE.Vector3( -1.5, 0 ),
  new THREE.Vector3( -3, 1.5 )
];

let isClosed = false

let controlPoints2 = [
  new THREE.Vector3( 0.5, -1 ),
  new THREE.Vector3( 1.5, 0 ),
  new THREE.Vector3( 0.5, 1 ),
];
let isClosed2 = false

let controlPoints3 = [
  new THREE.Vector3( 3, 0.5 ),
  new THREE.Vector3( 3.5, 1 ),
  new THREE.Vector3( 2.8, 1.2 )
];
let isClosed3 = false


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

graph();

function drawTriangle(ctx, a, b, c) {
    ctx.beginPath();
    ctx.moveTo(a.x * 50 + 250, -a.y * 50 + 250);
    ctx.lineTo(b.x * 50 + 250, -b.y * 50 + 250);
    ctx.lineTo(c.x * 50 + 250, -c.y * 50 + 250);
    ctx.fillStyle = '#AEAEAE'
    ctx.fill();
}

function graph() {
  var canvas = document.getElementById("myCanvas");
  var theContext = canvas.getContext("2d");
  var width = 500;
  var height = 500;

  theContext.strokeRect(0, 0, width, height)

  theContext.fillStyle = '#DDA500'
  theContext.strokeStyle = '#DDA500'

  //1

  controlPoints.forEach(elt => {
    theContext.fillRect(elt.x * 50 + 250 - 3, -elt.y * 50 + 250 - 3, 6, 6)
  })

  let points = bezierCurve(controlPoints, 20)

  theContext.beginPath();
  theContext.moveTo(points[0][0] * 50 + 250, -points[0][1] * 50 + 250);
  let x
  theContext.strokeStyle = '#DDA500'
  for (x = 1; x < points.length; x++) {
    theContext.lineTo(points[x].x * 50 + 250, -points[x].y* 50 + 250);
  }
  theContext.stroke();
  theContext.closePath()

  //2

  /*controlPoints2.forEach(elt => {
    theContext.fillRect(elt.x * 50 + 250 - 3, -elt.y * 50 + 250 - 3, 6, 6)
  })

  points = cSpline(controlPoints2, 100, isClosed2)

  theContext.beginPath();
  theContext.moveTo(points[0][0] * 50 + 250, -points[0][1] * 50 + 250);
  theContext.strokeStyle = '#DDA500'
  for (x = 1; x < points.length; x++) {
    theContext.lineTo(points[x].x * 50 + 250, -points[x].y* 50 + 250);
  }
  theContext.stroke();
  theContext.closePath()*/

  //3

  /*controlPoints3.forEach(elt => {
    theContext.fillRect(elt.x * 50 + 250 - 3, -elt.y * 50 + 250 - 3, 6, 6)
  })

  points = cSpline(controlPoints3, 100, isClosed3)

  theContext.beginPath();
  theContext.moveTo(points[0][0] * 50 + 250, -points[0][1] * 50 + 250);
  theContext.strokeStyle = '#DDA500'
  for (x = 1; x < points.length; x++) {
    theContext.lineTo(points[x].x * 50 + 250, -points[x].y* 50 + 250);
  }
  theContext.stroke();
  theContext.closePath()*/

  // LoftSurface

  /*let triangles = cLoftSurface([controlPoints, controlPoints2, controlPoints3], 0, [isClosed, isClosed2, isClosed3])

  //triangles.forEach(elt => drawTriangle(theContext, elt[0], elt[1], elt[2]))
  
  let iterVar = 0
  let interval = setInterval(() => {
    for(let i = 0; i < 500; i++) {
      drawTriangle(theContext, triangles[iterVar][0], triangles[iterVar][1], triangles[iterVar][2])
      iterVar++
      if(iterVar >= triangles.length) break
    }
    if(iterVar >= triangles.length) clearInterval(interval)
  })*/

}

