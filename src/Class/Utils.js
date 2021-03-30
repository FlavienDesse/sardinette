import {BufferGeometry, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, SphereGeometry} from "three";
import Constant from "./Constant";
import {bSpline, cSpline,mirrorPoint} from "./Math";
import * as THREE from "three";

/*
    CURRENT TYPE :
    - B-Spline
    - Point
    - C-Spline
    - Mirrored Point
 */

/*
    WHEN CREATE NEW OBJECT YOU HAVE TO UPDATE :
     - TabsObject
     - ModifyObjectWhenClickOn
     - updateWhenDeleted
     - increaseDefaultName
     - updateChildren
 */


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
            matches = Constant.DEFAULT_NAME_POINT.match(reg);
            Constant.DEFAULT_NAME_POINT = Constant.DEFAULT_NAME_POINT.replace(reg, parseInt(matches[0], 10) + 1)
            break;
        case "B-Spline":
            matches = Constant.DEFAULT_NAME_B_SPLINE.match(reg);
            Constant.DEFAULT_NAME_B_SPLINE = Constant.DEFAULT_NAME_B_SPLINE.replace(reg, parseInt(matches[0], 10) + 1)
            break;
        case "Surface":
            matches = Constant.DEFAULT_NAME_SURFACE.match(reg);
            Constant.DEFAULT_NAME_SURFACE = Constant.DEFAULT_NAME_SURFACE.replace(reg, parseInt(matches[0], 10) + 1)
            break;
        case "C-Spline":
            matches = Constant.DEFAULT_NAME_C_SPLINE.match(reg);
            Constant.DEFAULT_NAME_C_SPLINE = Constant.DEFAULT_NAME_C_SPLINE.replace(reg, parseInt(matches[0], 10) + 1)
            break;
        case "Mirrored Point":
            matches = Constant.DEFAULT_NAME_MIRRORED_POINT.match(reg);
            Constant.DEFAULT_NAME_MIRRORED_POINT = Constant.DEFAULT_NAME_MIRRORED_POINT.replace(reg, parseInt(matches[0], 10) + 1)
            break;
        default:
            throw new Error("unknow type provided")
    }
}





function updateChildren(allObject, currentObject, isDeletion) {
    let res = allObject.map((prev) => {

        if (  currentObject.childrenID.includes(prev.id)) {
            if (prev.type === "B-Spline") {
                if (isDeletion) {
                    prev.controlsPoints = prev.controlsPoints.filter(controlsPoints => controlsPoints.id !== currentObject.id)
                }
                try {
                    prev.geometry = modificationBSpline(prev)
                    updateChildren(allObject, prev, false)
                } catch (e) {
                    prev.isError = true
                }
            } else if (prev.type === "C-Spline") {

                if (isDeletion) {
                    prev.controlsPoints = prev.controlsPoints.filter(controlsPoints => controlsPoints.id !== currentObject.id)
                }
                try {
                    prev.geometry = modificationCSpline(prev)
                    updateChildren(allObject, prev, false)
                } catch (e) {
                    prev.isError = true
                }
            }else if (prev.type === "Mirrored Point") {
                if (isDeletion) {
                    prev.initialPoint =null;
                }
                try {
                    let res = modificationMirroredPoint(prev.initialPoint,prev.axis)
                    prev.position.set(res.x,res.y,res.z)
                    updateChildren(allObject, prev, false)
                } catch (e) {
                    prev.isError = true

                }
            }
        }
        return prev
    })
    return res
}

function createMirroredPoint() {
    const geometry = new SphereGeometry(Constant.DEFAULT_SIZE_POINT, 32, 32);
    let material = new MeshBasicMaterial({color: Constant.DEFAULT_COLOR_POINT});
    const point = new Mesh(geometry, material);
    point.type = "Mirrored Point"
    point.name = Constant.DEFAULT_NAME_MIRRORED_POINT
    increaseDefaultName("Mirrored Point")
    point.isError = true
    point.initialPoint = null
    point.axis = null
    point.weight = 1
    point.childrenID = []
    return point
}


function createAxis(axis) {



    const origin = new THREE.Vector3( 0, 0, 0 );



    const length = 3;

    const red = 0xff0000;
    const blue = 0x00ff00;
    const green = 0x0000fff;


    let tempAxis={};


    switch (axis) {
        case 'x':
            const dirX = new THREE.Vector3( 1, 0, 0 );
            tempAxis = new THREE.ArrowHelper( dirX, origin, length, red );
            tempAxis.name="X Axis"
            tempAxis.value = "x";
            break
        case 'y':

            const dirY = new THREE.Vector3( 0, 1, 0 );
            tempAxis = new THREE.ArrowHelper( dirY, origin, length, blue );
            tempAxis.name="Y Axis"
            tempAxis.value = "y";
            break
        case 'z':

            const dirZ = new THREE.Vector3( 0, 0, 1 );
            tempAxis = new THREE.ArrowHelper( dirZ, origin, length, green );
            tempAxis.name="Z Axis"
            tempAxis.value = "z";
            break
    }
    tempAxis.type="Axis"
    tempAxis.isError=false
    tempAxis.lock=true

    return tempAxis


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
    point.childrenID = []
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
    bSpline.childrenID = []
    bSpline.degree = 2
    bSpline.resolution = 100
    bSpline.isError = true
    return bSpline
}


function createCSpline() {


    const geometry = new BufferGeometry().setFromPoints([]);

    const material = new LineBasicMaterial({color: 0xff0000});
    const cSpline = new Line(geometry, material);
    cSpline.name = Constant.DEFAULT_NAME_C_SPLINE
    increaseDefaultName("C-Spline")
    cSpline.type = "C-Spline"
    cSpline.controlsPoints = []
    cSpline.childrenID = []
    cSpline.closed = false;
    cSpline.resolution = 100
    cSpline.isError = true
    return cSpline

}

function createSurface() {


    const geometry = new BufferGeometry().setFromPoints([]);

    const material = new LineBasicMaterial({color: 0xff0000});
    const surface = new Line(geometry, material);
    surface.name = Constant.DEFAULT_NAME_SURFACE
    increaseDefaultName("Surface")
    surface.type = "Surface"

    surface.childrenID = []
    surface.firstCurve = {}
    surface.secondCurve = {}

    surface.isError = true
    return surface

}


function modificationCSpline(cSplineParam) {
    let allControlsPoints = cSplineParam.controlsPoints.map(a => a.position);
    try {
        let res = cSpline(allControlsPoints, cSplineParam.resolution, cSplineParam.closed)
        const geometry = new BufferGeometry().setFromPoints(res);
        return geometry
    } catch (e) {
        throw new Error(e.message)
    }
}

function modificationMirroredPoint(point,axis) {
    let posPoint = {...point.position}

    try {
        let res = mirrorPoint(posPoint, axis.value)
        return res
    } catch (e) {
        throw new Error(e.message)
    }
}

function modificationBSpline(bSplineParam) {
    let allControlsPoints = bSplineParam.controlsPoints.map(a => a.position);
    try {
        let res = bSpline(bSplineParam.degree, allControlsPoints, bSplineParam.resolution, null, bSplineParam.controlsPoints.map(a => a.weight))
        const geometry = new BufferGeometry().setFromPoints(res);
        return geometry
    } catch (e) {
        throw new Error(e.message)
    }
}


function modifyObjectWhenClickOn(object, currentObject) {


    if (currentObject != null && (object == null || (currentObject.id !== object.id))) {
        if (currentObject.type === "Point"|| currentObject.type ==="Mirrored Point") {

            currentObject.scale.x = currentObject.currentScale.x
            currentObject.scale.y = currentObject.currentScale.y
            currentObject.scale.z = currentObject.currentScale.z
        }

    }


    if (object != null) {
        if (object.type === "Point" || object.type ==="Mirrored Point") {
            if (currentObject == null || (currentObject.id !== object.id)) {
                let intersect = object

                intersect.currentScale = {...intersect.scale}
                intersect.scale.x += Constant.DEFAULT_SIZE_POINT_SELECTED
                intersect.scale.y += Constant.DEFAULT_SIZE_POINT_SELECTED
                intersect.scale.z += Constant.DEFAULT_SIZE_POINT_SELECTED

                return intersect;
            } else {
                return currentObject
            }
        }else if (object.type === "B-Spline") {
            if (currentObject == null || (currentObject.id !== object.id)) {

                let intersect = object

                return intersect;

            } else {
                return currentObject
            }
        } else if (object.type === "C-Spline") {
            if (currentObject == null || (currentObject.id !== object.id)) {

                let intersect = object

                return intersect;

            } else {
                return currentObject
            }
        } else if (object.type === "Surface") {
            if (currentObject == null || (currentObject.id !== object.id)) {

                let intersect = object


                return intersect;

            } else {
                return currentObject
            }
        } else if (object.type === "Axis") {
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
    createPoint,
    changeColorLightness,
    modifyObjectWhenClickOn,
    createBSpline,
    modificationBSpline,
    updateChildren,
    createSurface,
    createCSpline,
    modificationCSpline,
    createAxis,
    createMirroredPoint,
    modificationMirroredPoint
}

