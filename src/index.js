import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import spline from './utils/spline.mjs'

let controlPoints = [
  [-1.0,  0.0],
  [-0.5,  0.5],
  [ 0.5, -0.5],
  [ 1.0,  0.0],
  // Repeat the degree + 1 points for a closed curve
  [-1.0,  0.0],
  [-0.5,  0.5],
  [ 0.5, -0.5]
];


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
  for (var x = 1; x < points.length; x++) {
    theContext.lineTo((points[x][0]) * 50 + 250, -points[x][1] * 50 + 250);
  }
  theContext.stroke();
}

