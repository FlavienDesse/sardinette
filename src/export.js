import * as THREE from 'three'
import { saveAs } from 'file-saver'
//FileSaver saveAs(Blob/File/Url, optional DOMString filename, optional Object { autoBom }) //???


/* with SaveFile.js

var exporter = new THREE.STLExporter();
var str = exporter.parse( scene ); // Export the scene
var blob = new Blob( [str], { type : 'text/plain' } ); // Generate Blob from the string
saveAs( blob, 'file.stl' ); //Save the Blob to file.stl

*/

var exporter = new THREE.STLExporter();
var str = exporter.parse( scene ); // Export the scene
var blob = new Blob( [str], { type : 'text/plain' } ); // Generate Blob from the string
//saveAs( blob, 'file.stl' ); //Save the Blob to file.stl

//Following code will help you to save the file without FileSaver.js
var link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link);
link.href = URL.createObjectURL(blob);
link.download = 'Scene.stl';
link.click();