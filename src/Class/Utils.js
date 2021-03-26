import {SphereGeometry} from "three";
import {Mesh} from "three";
import {MeshBasicMaterial} from "three";
import Constant from "./Constant";

function changeColorLightness(color, lightness) {
    const r = (color & 0xFF0000) / 0x10 ** 4;
    const g = (color & 0x00FF00) / 0x10 ** 2;
    const b = (color & 0x0000FF);

    const changedR = Math.max(0, Math.min(r + lightness, 0xFF));
    const changedG = Math.max(0, Math.min(g + lightness, 0xFF));
    const changedB = Math.max(0, Math.min(b + lightness, 0xFF));

    return (changedR * 0x10 ** 4) + (changedG * 0x10 ** 2) + changedB;
}


function createPoint() {
    const geometry = new SphereGeometry(Constant.DEFAULT_SIZE_POINT, 32, 32);
    let material = new MeshBasicMaterial({color: Constant.DEFAULT_COLOR_POINT});
    const point = new Mesh(geometry, material);
    point.type = "Point"
    point.isError = false
    point.weight = 1
    return point
}


function createBSpline() {
    const geometry = new SphereGeometry(Constant.DEFAULT_SIZE_POINT, 32, 32);
    let material = new MeshBasicMaterial({color: Constant.DEFAULT_COLOR_POINT});
    const bSpline = new Mesh(geometry, material);

    bSpline.type = "B-Spline"
    bSpline.isError = true
    return bSpline
}

function modifyObjectWhenClickOn(object, currentObject) {

    if (object === null && currentObject != null) {
        if (currentObject.type === "Point") {
            currentObject.scale.x = currentObject.currentScale.x
            currentObject.scale.y = currentObject.currentScale.y
            currentObject.scale.z = currentObject.currentScale.z
        }
    } else if (object != null ) {
        if (object.type === "Point") {
            if (currentObject == null || (currentObject.id !== object.id)) {
                if (currentObject != null && currentObject.id !== object.id) {
                    currentObject.scale.x = currentObject.currentScale.x
                    currentObject.scale.y = currentObject.currentScale.y
                    currentObject.scale.z = currentObject.currentScale.z
                }

                let intersect = object

                intersect.currentScale = {...intersect.scale}
                intersect.scale.x += 0.5
                intersect.scale.y += 0.5
                intersect.scale.z += 0.5

                return intersect;

            }
            else{
                return currentObject
            }
        }
    }


    return null;


}

export {
    createPoint, changeColorLightness, modifyObjectWhenClickOn
}

