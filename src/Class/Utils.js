import {BufferGeometry} from "three";
import {SphereGeometry} from "three";
import {Mesh} from "three";
import {MeshBasicMaterial} from "three";
import Constant from "./Constant";

function changeColorLightness(color, lightness) {
    const r = (color & 0xFF0000) / 0x10**4;
    const g = (color & 0x00FF00) / 0x10**2;
    const b = (color & 0x0000FF);

    const changedR = Math.max(0, Math.min(r + lightness, 0xFF));
    const changedG = Math.max(0, Math.min(g + lightness, 0xFF));
    const changedB = Math.max(0, Math.min(b + lightness, 0xFF));

    return (changedR * 0x10**4) + (changedG * 0x10**2) + changedB;
}



function createPoint(){
    const geometry = new SphereGeometry( Constant.DEFAULT_SIZE_POINT, 32, 32 );
    let material  = new MeshBasicMaterial({color : Constant.DEFAULT_COLOR_POINT});
    const sphere = new Mesh( geometry, material );
   // sphere.position.set(0, 1, 0);
    return sphere
}


export {
    createPoint,changeColorLightness
}

