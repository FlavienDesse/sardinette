import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {spline, cSpline, toVector3, fromVector3, getSurface} from './utils/spline.js'
import * as THREE from 'three'

let controlPoints = fromVector3([
  new THREE.Vector3( 2, - 1.5 ),
  new THREE.Vector3( 1, 1 ),
  new THREE.Vector3( 2.5, 3.5 )
]);

let controlPoints2 = [
  new THREE.Vector3( 1.5, - 1 ),
  new THREE.Vector3( 1, 1 ),
  new THREE.Vector3( -1, 2 ),
  new THREE.Vector3( 2, 3 )
]
controlPoints2.forEach(elt => { elt.x -= 3 })

console.log(controlPoints)
console.log(controlPoints2)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

graph();

function drawTriangle(ctx, a, b, c) {
    ctx.beginPath();
    ctx.moveTo(a[0] * 50 + 250, -a[1] * 50 + 250);
    ctx.lineTo(b[0] * 50 + 250, -b[1] * 50 + 250);
    ctx.lineTo(c[0] * 50 + 250, -c[1] * 50 + 250);
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
  controlPoints.forEach(elt => {
    theContext.fillRect(elt[0] * 50 + 250 - 3, -elt[1] * 50 + 250 - 3, 6, 6)
  })

  let points = spline(2, controlPoints, 100)

  theContext.beginPath();
  theContext.moveTo(points[0][0] * 50 + 250, -points[0][1] * 50 + 250);
  let x
  theContext.strokeStyle = '#DDA500'
  for (x = 1; x < points.length; x++) {
    theContext.lineTo((points[x][0]) * 50 + 250, -points[x][1] * 50 + 250);
  }
  theContext.stroke();
  theContext.closePath()

  theContext.fillStyle = '#00DDA5'
  controlPoints2.forEach(elt => {
    theContext.fillRect(elt.x * 50 + 250 - 3, -elt.y * 50 + 250 - 3, 6, 6)
  })

  let points2 = cSpline(controlPoints2, 80)

  theContext.beginPath();
  theContext.moveTo(points2[0].x * 50 + 250, -points2[0].y * 50 + 250);
  theContext.strokeStyle = '#00DDA5'
  for (x = 0; x < points2.length; x++) {
    theContext.lineTo((points2[x].x) * 50 + 250, -points2[x].y * 50 + 250);
  }
  theContext.stroke();
  theContext.closePath()

  let triangles = getSurface(points, fromVector3(points2))
  console.log(triangles)
  triangles.forEach(elt => {
    drawTriangle(theContext, elt[0], elt[1], elt[2])
  })
}

