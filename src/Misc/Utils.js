import {BufferGeometry, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, SphereGeometry, Vector3, Face} from "three";
import Constant from "./Constant";
import {bSpline, cSpline, mirrorCurve, mirrorPoint, getSurface} from "./Math";
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
        case "Mirrored Curve":
            matches = Constant.DEFAULT_NAME_MIRRORED_CURVE.match(reg);
            Constant.DEFAULT_NAME_MIRRORED_CURVE = Constant.DEFAULT_NAME_MIRRORED_CURVE.replace(reg, parseInt(matches[0], 10) + 1)
            break;
        case "NURBS":
            matches = Constant.DEFAULT_NAME_NURBS.match(reg);
            Constant.DEFAULT_NAME_NURBS = Constant.DEFAULT_NAME_NURBS.replace(reg, parseInt(matches[0], 10) + 1)
            break;
        default:
            throw new Error("unknow type provided")
    }
}



const updateObjectByAddingChildrenID = (allUpdatedObject, id,allObject,setAllObject) => {

    let allIDUpdated = allUpdatedObject.map(prev => prev.id)

    let newState = allObject.map(prev => {
        if (allIDUpdated.includes(prev.id) && !prev.childrenID.includes(prev.id)) {
            prev.childrenID.push(id )

        }
        return prev
    })


    setAllObject(newState)
}

function updateChildren(allObject, currentObject, isDeletion) {

    let allChildrenInfo = []


    currentObject.childrenID.forEach((id) => {
        allChildrenInfo.push({
                id: id,
                isError: currentObject.isError,
            }
        )
    })


    while (allChildrenInfo.length !== 0) {


        let tempInfo = []

        allChildrenInfo.forEach((value => {
            let prev = allObject.find(object => object.id === value.id)

            if (prev === undefined) {


                allObject.forEach((obj) => {
                    const index = obj.childrenID.indexOf(value.id);
                    if (index > -1) {
                        obj.childrenID.splice(index, 1);
                    }
                })
            } else {
                if (prev.type === "B-Spline" || prev.type === "C-Spline" ) {
                    if (isDeletion) {
                        prev.controlsPoints = prev.controlsPoints.filter(controlsPoints => controlsPoints.id !== currentObject.id)
                    }

                } else if (prev.type === "Mirrored Point") {
                    if (isDeletion) {
                        prev.initialPoint = null;
                    }

                } else if (prev.type === "Mirrored Curve") {
                    if (isDeletion) {
                        prev.initialCurve = null;
                    }
                    if (value.isError) {
                        prev.isError = true
                    } else {
                        prev.update()
                    }

                } else if (prev.type === "Surface") {
                    if (isDeletion) {
                        prev.firstCurve = null;
                        prev.secondCurve = null;
                    }

                }


                if (value.isError) {
                    prev.isError = true
                } else {
                    try{
                        prev.update()
                    }
                    catch (e){

                    }
                }

                prev.childrenID.forEach((id) => {
                    tempInfo.push({
                            id: id,
                            isError: prev.isError,
                        }
                    )
                })
            }


        }))
        isDeletion = false;
        allChildrenInfo = tempInfo
    }


    return allObject


}


function createAxis(axis) {





    let tempAxis = {};


    switch (axis) {
        case 'x':
            tempAxis.name = "X Axis"
            tempAxis.value = "x";
            break
        case 'y':


            tempAxis.name = "Y Axis"
            tempAxis.value = "y";
            break
        case 'z':


            tempAxis.name = "Z Axis"
            tempAxis.value = "z";
            break
    }
    tempAxis.visible=false;
    tempAxis.type = "Axis"
    tempAxis.isError = false
    tempAxis.lock = true
    tempAxis.childrenID = []
    return tempAxis


}

function createMirroredPoint(initialPoint, axis) {
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




    point.update = () => {


        try {
            let res = mirrorPoint(point.initialPoint.position, point.axis.value)
            point.position.set(res.x, res.y, res.z)
            point.isError = false
        } catch (e) {
            point.isError = true
            throw new Error(e.message)
        }

    }

    if(initialPoint && axis){
        point.axis = axis
        point.initialPoint=initialPoint
        initialPoint.childrenID.push(point.id)
        point.update()
    }

    return point
}

function createPoint(position) {


    const geometry = new SphereGeometry(Constant.DEFAULT_SIZE_POINT, 32, 32);
    let material = new MeshBasicMaterial({color: Constant.DEFAULT_COLOR_POINT});
    const point = new Mesh(geometry, material);


    if (position) {
        point.position.set(position.x, position.y, position.z)
    }


    point.type = "Point"
    point.name = Constant.DEFAULT_NAME_POINT
    increaseDefaultName("Point")
    point.isError = false
    point.weight = 1
    point.childrenID = []


    point.update = () => {

    }


    return point
}

function createNURBS(controlsPoints) {


    const geometry = new BufferGeometry().setFromPoints([]);

    const material = new LineBasicMaterial({color: Constant.DEFAULT_COLOR_CURVE});
    const NURBS = new Line(geometry, material);
    NURBS.name = Constant.DEFAULT_NAME_NURBS
    increaseDefaultName("NURBS")
    NURBS.type = "NURBS"
    NURBS.controlsPoints = []
    NURBS.childrenID = []
    NURBS.degree = 2
    NURBS.resolution = 100
    NURBS.isError = true
    NURBS.allCalculatedPoints = []
    NURBS.knots = []

    if (controlsPoints) {

        try {
            let allPositionControlsPoints = controlsPoints.map(a => a.position);
            NURBS.knots =  new Array(controlsPoints.length+ NURBS.degree+1).fill().map((_, index) => index + 1);

            let res = bSpline(NURBS.degree, allPositionControlsPoints, NURBS.resolution, NURBS.knots, controlsPoints.map(a => a.weight))

            NURBS.allCalculatedPoints = res
            NURBS.geometry = new BufferGeometry().setFromPoints(res);
            NURBS.isError = false
            NURBS.controlsPoints = controlsPoints


            controlsPoints.forEach((controls) => {
                controls.childrenID.push(NURBS.id)
            })

        } catch (e) {
            console.log(e.message)
            throw new Error("Error in creation NURBS")
        }
    }


    NURBS.update = () => {

        let allControlsPoints = NURBS.controlsPoints.map(a => a.position);
        try {
            let res = bSpline(NURBS.degree, allControlsPoints, NURBS.resolution, NURBS.knots, NURBS.controlsPoints.map(a => a.weight))
            NURBS.allCalculatedPoints = res
            NURBS.geometry = new BufferGeometry().setFromPoints(res);
            NURBS.isError = false

        } catch (e) {
            NURBS.isError = true
            throw new Error(e.message)
        }
    }


    return NURBS
}


function createBSpline(controlsPoints) {


    const geometry = new BufferGeometry().setFromPoints([]);

    const material = new LineBasicMaterial({color: Constant.DEFAULT_COLOR_CURVE});
    const bSplineParam = new Line(geometry, material);
    bSplineParam.name = Constant.DEFAULT_NAME_B_SPLINE
    increaseDefaultName("B-Spline")
    bSplineParam.type = "B-Spline"
    bSplineParam.controlsPoints = []
    bSplineParam.childrenID = []
    bSplineParam.degree = 2
    bSplineParam.resolution = 100
    bSplineParam.isError = true
    bSplineParam.allCalculatedPoints = []

    if (controlsPoints) {
        try {
            let allPositionControlsPoints = controlsPoints.map(a => a.position);
            let res = bSpline(bSplineParam.degree, allPositionControlsPoints, bSplineParam.resolution, null, controlsPoints.map(a => a.weight))
            bSplineParam.allCalculatedPoints = res
            bSplineParam.geometry = new BufferGeometry().setFromPoints(res);
            bSplineParam.isError = false
            bSplineParam.controlsPoints = controlsPoints


            controlsPoints.forEach((controls) => {
                controls.childrenID.push(bSplineParam.id)
            })

        } catch (e) {
            throw new Error("Error in creation b spline")
        }
    }


    bSplineParam.update = () => {
        let allControlsPoints = bSplineParam.controlsPoints.map(a => a.position);
        try {
            let res = bSpline(bSplineParam.degree, allControlsPoints, bSplineParam.resolution, null, bSplineParam.controlsPoints.map(a => a.weight))
            bSplineParam.allCalculatedPoints = res
            bSplineParam.geometry = new BufferGeometry().setFromPoints(res);
            bSplineParam.isError = false

        } catch (e) {
            bSplineParam.isError = true
            throw new Error(e.message)
        }
    }


    return bSplineParam
}

function createMirroredCurve(initialCurve, axis) {

    const geometry = new BufferGeometry().setFromPoints([]);

    const material = new LineBasicMaterial({color: Constant.DEFAULT_COLOR_CURVE});
    const mirroredCurve = new Line(geometry, material);
    mirroredCurve.name = Constant.DEFAULT_NAME_MIRRORED_CURVE
    increaseDefaultName("Mirrored Curve")
    mirroredCurve.type = "Mirrored Curve"
    mirroredCurve.initialCurve = null
    mirroredCurve.axis = null
    mirroredCurve.childrenID = []
    mirroredCurve.isError = true
    mirroredCurve.allCalculatedPoints = []


    if (initialCurve && axis) {
        try {
            let res = mirrorCurve(initialCurve.allCalculatedPoints, axis.value)
            mirroredCurve.allCalculatedPoints = res
            mirroredCurve.geometry = new BufferGeometry().setFromPoints(res);
            mirroredCurve.isError = false
            mirroredCurve.initialCurve = initialCurve
            mirroredCurve.axis = axis
            initialCurve.childrenID.push(mirroredCurve.id)

        } catch (e) {
            console.log(e)
        }
    }

    mirroredCurve.update = () => {
        try {
            let points = mirrorCurve(mirroredCurve.initialCurve.allCalculatedPoints, mirroredCurve.axis.value)
            mirroredCurve.allCalculatedPoints = points
            mirroredCurve.geometry = new BufferGeometry().setFromPoints(points);
            mirroredCurve.isError = false;

        } catch (e) {
            mirroredCurve.isError = true;
            throw new Error(e.message)
        }
    }

    return mirroredCurve
}


function createCSpline() {


    const geometry = new BufferGeometry().setFromPoints([]);

    const material = new LineBasicMaterial({color: Constant.DEFAULT_COLOR_CURVE});
    const spline = new Line(geometry, material);
    spline.name = Constant.DEFAULT_NAME_C_SPLINE
    increaseDefaultName("C-Spline")
    spline.type = "C-Spline"
    spline.controlsPoints = []
    spline.allCalculatedPoints = []
    spline.childrenID = []
    spline.closed = false;
    spline.resolution = 100
    spline.isError = true


    spline.update = () => {
        let allControlsPoints = spline.controlsPoints.map(a => a.position);

        try {
            let res = cSpline(allControlsPoints, spline.resolution, spline.closed)
            spline.allCalculatedPoints = res
            spline.geometry = new BufferGeometry().setFromPoints(res);
            spline.isError = false;

        } catch (e) {
            spline.isError = true;
            throw new Error(e.message)
        }
    }


    return spline

}

function createSurface(firstCurve, secondCurve) {


    const geometrySurface = new THREE.BufferGeometry();
    const geometryLine = new THREE.BufferGeometry();

    const material = new THREE.MeshBasicMaterial({
        color: Constant.DEFAULT_COLOR_SURFACE,
        opacity: 0.5,
        transparent: true,
        side: THREE.DoubleSide
    });
    const lineMaterial = new THREE.MeshBasicMaterial({color: Constant.DEFAULT_COLOR_SURFACE, side: THREE.DoubleSide});

    const surface = new THREE.Mesh(geometrySurface, material);
    const line = new THREE.Line(geometryLine, lineMaterial);

    surface.name = Constant.DEFAULT_NAME_SURFACE
    increaseDefaultName("Surface")
    surface.type = "Surface"

    surface.childrenID = []
    surface.firstCurve = {}
    surface.secondCurve = {}

    surface.isError = true


    if (firstCurve && secondCurve) {
        try {

            surface.children.push(line)

            let pointFirstCurve = firstCurve.allCalculatedPoints
            let pointSecondCurve = secondCurve.allCalculatedPoints


            let res = getSurface(pointFirstCurve, pointSecondCurve)

            let geometry = new THREE.BufferGeometry();
            let numTriangles = res.length

            let positions = new Float32Array(numTriangles * 3 * 9);


            for (let i = 0; i < numTriangles; i++) {
                let triangle = res[i]

                for (let j = 0; j < 9; j++) {

                    let index = Math.floor(j % 3)
                    positions[i * 27 + j * 3] = triangle[index].x
                    positions[i * 27 + j * 3 + 1] = triangle[index].y
                    positions[i * 27 + j * 3 + 2] = triangle[index].z
                }

            }


            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));


            surface.firstCurve = firstCurve
            surface.secondCurve = secondCurve
            surface.isError = false

            firstCurve.childrenID.push(surface.id);
            secondCurve.childrenID.push(surface.id);

            // line.geometry=geometry

            surface.geometry = geometry

        } catch (e) {
            console.log(e)
        }
    }





    surface.update = ()=>{
        let pointFirstCurve = surface.firstCurve.allCalculatedPoints
        let pointSecondCurve =  surface.secondCurve.allCalculatedPoints

        try {
            let res = getSurface(pointFirstCurve, pointSecondCurve)

            let geometry = new THREE.BufferGeometry();
            let numTriangles = res.length

            let positions = new Float32Array(numTriangles * 3 * 9);


            for (let i = 0; i < numTriangles; i++) {
                let triangle = res[i]

                for (let j = 0; j < 9; j++) {

                    let index = Math.floor(j % 3)
                    positions[i * 27 + j * 3] = triangle[index].x
                    positions[i * 27 + j * 3 + 1] = triangle[index].y
                    positions[i * 27 + j * 3 + 2] = triangle[index].z
                }

            }


            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));


            surface.geometry = geometry
            surface.isError = false
        } catch (e) {
            surface.isError = true
            throw new Error(e.message)
        }

    }



    return surface

}

function modifyObjectWhenClickOn(object, currentObject) {


    if (currentObject != null && (object == null || (currentObject.id !== object.id))) {
        if (currentObject.type === "Point" || currentObject.type === "Mirrored Point") {

            currentObject.scale.x = currentObject.currentScale.x
            currentObject.scale.y = currentObject.currentScale.y
            currentObject.scale.z = currentObject.currentScale.z
        }

    }


    if (object != null) {
        if (object.type === "Point" || object.type === "Mirrored Point" ) {
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
        } else if (object.type === "B-Spline") {
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
        } else if (object.type === "Mirrored Curve") {
            if (currentObject == null || (currentObject.id !== object.id)) {

                let intersect = object


                return intersect;

            } else {
                return currentObject
            }
        }
        else if (object.type === "NURBS") {
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
    updateChildren,
    createSurface,
    createCSpline,
    createAxis,
    createMirroredPoint,
    createMirroredCurve,
    updateObjectByAddingChildrenID,
    createNURBS
}

