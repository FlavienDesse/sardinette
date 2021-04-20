import {STLExporter} from "three/examples/jsm/exporters/STLExporter"
import {GLTFExporter} from "three/examples/jsm/exporters/GLTFExporter"
import {saveAs} from 'file-saver';
import Constant from "./Constant";


const exportSTL = (scene) => {

    let allChildren = scene.children


    let children = []

    console.log(scene.children[1])

    scene.children[1].children.forEach((object) => {
        if (Constant.CONSTANT_ALL_SURFACES.includes(object.userData.type)) {
            children.push(object)
        }
    })
    if (children.length === 0) {
        throw new Error(" please add at least one surface ")
    }
    scene.children = children
    var exporter = new STLExporter();
    var str = exporter.parse(scene); // Export the scene
    var blob = new Blob([str], {type: 'text/plain'}); // Generate Blob from the string
    saveAs(blob, 'file.stl'); //Save the Blob to file.stl
    scene.children = allChildren
}

const exportScene = (scene) => {


    const exporter = new GLTFExporter();

    const options = {
        trs: false,
        onlyVisible: false,
        includeCustomExtensions: false,
    };


    exporter.parse(scene.current.children[1], function (result) {
        let blob;
        if (result instanceof ArrayBuffer) {

            blob = new Blob([result], {type: 'application/octet-stream'});

        } else {
            blob = new Blob([JSON.stringify(result)], {type: 'text/plain'});


        }

        saveAs(blob, 'save.gltf');
    }, options);


}


export {
    exportSTL, exportScene
}