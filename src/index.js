import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {spline, cSpline, toVector3, fromVector3, getSurface, mirrorPoint, mirrorPointFromCurve} from './utils/spline.js'
import * as THREE from 'three'

let controlPoints = fromVector3([
  new THREE.Vector3( -1, -5 ),
  new THREE.Vector3( 0.5, 0 ),
  new THREE.Vector3( -1, 5 )
]);

let point = new THREE.Vector3(1.5, 1)

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


  theContext.fillRect(point.x* 50 + 250 - 3, -point.y* 50 + 250 - 3, 6, 6)

  let mirrored = mirrorPoint(point, 'X')

  console.log(point, points, mirrored)

  theContext.fillRect(mirrored.x* 50 + 250 - 3, -mirrored.y* 50 + 250 - 3, 6, 6)

}

