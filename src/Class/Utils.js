import {BufferGeometry} from "three";
import {SphereGeometry} from "three";
import {Mesh} from "three";
import {MeshBasicMaterial} from "three";
import Constant from "./Constant";




function createPoint(){
    const geometry = new SphereGeometry( Constant.DEFAULT_SIZE_POINT, 32, 32 );
    let material  = new MeshBasicMaterial({color : Constant.DEFAULT_COLOR_POINT});
    const sphere = new Mesh( geometry, material );
   // sphere.position.set(0, 1, 0);
    return sphere
}


export {
    createPoint
}

