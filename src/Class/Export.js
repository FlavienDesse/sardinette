import {STLExporter} from "three/examples/jsm/exporters/STLExporter"
import { saveAs } from 'file-saver';
import Constant from "./Constant";


const exportSTL = (scene)=>{

    let allChildren = scene.children

    let children = []


    scene.children[1].children.forEach((object)=>{
        if(Constant.CONSTANT_ALL_SURFACES.includes(object.type)){
            children.push(object)
        }
    })
    scene.children = children

    


    var exporter = new STLExporter();
    var str = exporter.parse( scene ); // Export the scene
    var blob = new Blob( [str], { type : 'text/plain' } ); // Generate Blob from the string
    saveAs( blob, 'file.stl' ); //Save the Blob to file.stl
    scene.children = allChildren
}


export {
    exportSTL
}