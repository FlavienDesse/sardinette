import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {spline, toVector3} from './utils/spline.js'

let controlPoints = [
  [0.0,  0.0, 0],
  [-0.6,  0.7, 0],
  [-1,  1.5, 0],
  [-0.5,  2, 0],
  [0,  1.5, 0],
  [0.5,  2, 0],
  [1,  1.5, 0],
  [0.6,  0.7, 0],
  [0.0,  0.0, 0],
  [-0.6,  0.7, 0],
  [-1,  1.5, 0],
];

let controlPoints2 = toVector3(controlPoints)
controlPoints2.forEach(elt => { elt.x -= 2 })

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

graph();
function graph() {
  var canvas = document.getElementById("myCanvas");
  var theContext = canvas.getContext("2d");
  var width = 500;
  var height = 500;

  theContext.strokeRect(0, 0, width, height)

  controlPoints.forEach(elt => {
    theContext.fillRect(elt[0] * 50 + 250 - 3, -elt[1] * 50 + 250 - 3, 6, 6)
  })

  let points = spline(2, controlPoints)

  theContext.beginPath();
  theContext.moveTo(points[0][0] * 50 + 250, -points[0][1] * 50 + 250);
  let x
  for (x = 1; x < points.length; x++) {
    theContext.lineTo((points[x][0]) * 50 + 250, -points[x][1] * 50 + 250);
  }
  theContext.stroke();
  theContext.closePath()

  controlPoints2.forEach(elt => {
    theContext.fillRect(elt.x * 50 + 250 - 3, -elt.y * 50 + 250 - 3, 6, 6)
  })

  points = spline(2, controlPoints2)

  theContext.beginPath();
  theContext.moveTo(points[0].x * 50 + 250, -points[0].y * 50 + 250);
  for (x = 1; x < points.length; x++) {
    theContext.lineTo((points[x].x) * 50 + 250, -points[x].y * 50 + 250);
  }
  theContext.stroke();
  theContext.closePath()
}

