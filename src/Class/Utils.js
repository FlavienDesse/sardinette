import {SphereGeometry} from "three";
import {Mesh} from "three";
import {MeshBasicMaterial, SplineCurve, Vector3, BufferGeometry, Line, LineBasicMaterial} from "three";
import Constant from "./Constant";
import {spline} from "./Math";

function changeColorLightness(color, lightness) {
    const r = (color & 0xFF0000) / 0x10 ** 4;
    const g = (color & 0x00FF00) / 0x10 ** 2;
    const b = (color & 0x0000FF);

    const changedR = Math.max(0, Math.min(r + lightness, 0xFF));
    const changedG = Math.max(0, Math.min(g + lightness, 0xFF));
    const changedB = Math.max(0, Math.min(b + lightness, 0xFF));

    return (changedR * 0x10 ** 4) + (changedG * 0x10 ** 2) + changedB;
}

/**
 * @param {string} type of the object , example : "Point"

 */
function increaseDefaultName(type) {
    const reg = new RegExp("\\d+$[D]*")
    let matches;
    switch (type) {
        case "Point":
            matches =  Constant.DEFAULT_NAME_POINT.match(reg);
            Constant.DEFAULT_NAME_POINT = Constant.DEFAULT_NAME_POINT.replace(reg, parseInt(matches[0], 10)+1)
            break;
        case "B-Spline":
            matches =  Constant.DEFAULT_NAME_B_SPLINE.match(reg);
            Constant.DEFAULT_NAME_B_SPLINE = Constant.DEFAULT_NAME_B_SPLINE.replace(reg, parseInt(matches[0], 10)+1)
            break;
    }
}

function createPoint() {
    const geometry = new SphereGeometry(Constant.DEFAULT_SIZE_POINT, 32, 32);
    let material = new MeshBasicMaterial({color: Constant.DEFAULT_COLOR_POINT});
    const point = new Mesh(geometry, material);
    point.type = "Point"
    point.name = Constant.DEFAULT_NAME_POINT
    increaseDefaultName("Point")
    point.isError = false
    point.weight = 1
    return point
}


function createBSpline() {



    const geometry = new BufferGeometry().setFromPoints([]);

    const material = new LineBasicMaterial({color: 0xff0000});
    const bSpline = new Line(geometry, material);
    bSpline.name = Constant.DEFAULT_NAME_B_SPLINE
    increaseDefaultName("B-Spline")
    bSpline.type = "B-Spline"
    bSpline.controlsPoints = []
    bSpline.degree = 2
    bSpline.resolution = 100
    bSpline.isError = true
    return bSpline
}


function modificationBSpline(bSpline) {

    let allControlsPoints = bSpline.controlsPoints.map(a => a.position);


    try {

        let res = spline(bSpline.degree,allControlsPoints,bSpline.resolution,null,bSpline.controlsPoints.map(a => a.weight))

        const geometry = new BufferGeometry().setFromPoints(res);

        return geometry
    }catch (e){
        throw new Error(e.message)
    }




}


function modifyObjectWhenClickOn(object, currentObject) {



    if(  currentObject != null && (object == null || (currentObject.id !== object.id))){
        if (currentObject.type === "Point") {
            currentObject.scale.x = currentObject.currentScale.x
            currentObject.scale.y = currentObject.currentScale.y
            currentObject.scale.z = currentObject.currentScale.z
        }
    }


    if (object != null) {
        if (object.type === "Point") {
            if (currentObject == null || (currentObject.id !== object.id)  ) {
                let intersect = object

                intersect.currentScale = {...intersect.scale}
                intersect.scale.x += Constant.DEFAULT_SIZE_POINT_SELECTED
                intersect.scale.y += Constant.DEFAULT_SIZE_POINT_SELECTED
                intersect.scale.z += Constant.DEFAULT_SIZE_POINT_SELECTED

                return intersect;

            } else {
                return currentObject
            }
        } else if (object.type === "B-Spline") {
            if (currentObject == null || (currentObject.id !== object.id)) {

                let intersect = object




                return intersect;

            } else {
                return currentObject
            }
        }
    }


    return null;


}

export {
    createPoint, changeColorLightness, modifyObjectWhenClickOn, createBSpline , modificationBSpline
}

