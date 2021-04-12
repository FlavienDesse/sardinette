import * as THREE from "three";
import {BufferGeometry, Mesh, MeshBasicMaterial, SphereGeometry} from "three";
import Constant from "./Constant";
import {bezierCurve, bSpline, cSpline, getSurface, mirrorCurve, mirrorPoint} from "./Math";
import {MeshLine, MeshLineMaterial, MeshLineRaycast} from 'three.meshline';

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
        case "Bezier":
            matches = Constant.DEFAULT_NAME_BEZIER.match(reg);
            Constant.DEFAULT_NAME_BEZIER = Constant.DEFAULT_NAME_BEZIER.replace(reg, parseInt(matches[0], 10) + 1)
            break;
        default:
            throw new Error("unknow type provided")
    }
}


const updateObjectByAddingChildrenID = (allUpdatedObject, id, allObject, setAllObject) => {

    let allIDUpdated = allUpdatedObject.map(prev => prev.id)

    let newState = allObject.map(prev => {
        if (allIDUpdated.includes(prev.id) && !prev.childrenID.includes(prev.id)) {
            prev.childrenID.push(id)

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

        allChildrenInfo.forEach(((value) => {
            let prev = allObject.find(object => object.id === value.id)

            if (prev === undefined) {


                allObject.forEach((obj) => {
                    const index = obj.childrenID.indexOf(value.id);
                    if (index > -1) {
                        obj.childrenID.splice(index, 1);
                    }
                })
            } else {
                if (prev.type === "B-Spline" || prev.type === "C-Spline" || prev.type === "C-Spline" || prev.type === "Bezier") {
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
                    try {
                        prev.update()
                    } catch (e) {

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
        default:
            throw new Error("axis type undefined")
    }
    tempAxis.visible = false;
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
            let res = mirrorPoint([point.initialPoint.position.x,point.initialPoint.position.y,point.initialPoint.position.z], point.axis.value)
            point.position.set(res[0],res[1], res[2])
            point.isError = false
        } catch (e) {
            point.isError = true
            throw new Error(e.message)
        }

    }

    if (initialPoint && axis) {
        point.axis = axis
        point.initialPoint = initialPoint
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

    const material = new MeshLineMaterial({
        color: Constant.DEFAULT_COLOR_CURVE,
        lineWidth: 0.04,
        sizeAttenuation: true,

    });

    const line = new MeshLine(geometry, material);


    const mesh = new THREE.Mesh(line, material);
    mesh.raycast = MeshLineRaycast;

    mesh.name = Constant.DEFAULT_NAME_NURBS
    increaseDefaultName("NURBS")
    mesh.type = "NURBS"
    mesh.controlsPoints = []
    mesh.childrenID = []
    mesh.degree = 2
    mesh.resolution = 100
    mesh.isError = true
    mesh.allCalculatedPoints = []
    mesh.knots = []

    if (controlsPoints) {

        try {
            let allPositionControlsPoints = controlsPoints.map(a => a.position);
            mesh.knots = new Array(controlsPoints.length + mesh.degree + 1).fill().map((_, index) => index + 1);

            let res = bSpline(mesh.degree, allPositionControlsPoints, mesh.resolution, mesh.knots, controlsPoints.map(a => a.weight))

            mesh.allCalculatedPoints = res
            line.setPoints(res)

            mesh.isError = false
            mesh.controlsPoints = controlsPoints


            controlsPoints.forEach((controls) => {
                controls.childrenID.push(mesh.id)
            })

        } catch (e) {
            console.log(e.message)
            throw new Error("Error in creation NURBS")
        }
    }


    mesh.update = () => {

        let allControlsPoints = mesh.controlsPoints.map(a => a.position);
        try {
            console.log(mesh.knots)
            let res = bSpline(mesh.degree, allControlsPoints, mesh.resolution, mesh.knots, mesh.controlsPoints.map(a => a.weight))
            mesh.allCalculatedPoints = res
            line.setPoints(res)
            mesh.isError = false

        } catch (e) {
            mesh.isError = true
            throw new Error(e.message)
        }
    }


    return mesh
}


function createBSpline(controlsPoints) {

    const geometry = new BufferGeometry().setFromPoints([]);

    const material = new MeshLineMaterial({
        color: Constant.DEFAULT_COLOR_CURVE,
        lineWidth: 0.04,
        sizeAttenuation: true,

    });

    const bSplineParam = new MeshLine(geometry, material);
    const mesh = new THREE.Mesh(bSplineParam, material);
    mesh.raycast = MeshLineRaycast;
    mesh.name = Constant.DEFAULT_NAME_B_SPLINE
    increaseDefaultName("B-Spline")
    mesh.type = "B-Spline"
    mesh.controlsPoints = []
    mesh.childrenID = []
    mesh.degree = 2
    mesh.resolution = 100
    mesh.isError = true
    mesh.allCalculatedPoints = []

    if (controlsPoints) {
        try {
            let allPositionControlsPoints = controlsPoints.map(a => a.position);

            let res = bSpline(mesh.degree, allPositionControlsPoints, mesh.resolution, null, controlsPoints.map(a => a.weight))
            mesh.allCalculatedPoints = res
            bSplineParam.setPoints(res)
            mesh.isError = false
            mesh.controlsPoints = controlsPoints


            controlsPoints.forEach((controls) => {
                controls.childrenID.push(mesh.id)
            })

        } catch (e) {
            console.log(e.message)
            throw new Error("Error in creation b spline")
        }
    }
    mesh.update = () => {
        let allControlsPoints = mesh.controlsPoints.map(a => a.position);
        try {
            let res = bSpline(mesh.degree, allControlsPoints, mesh.resolution, null, mesh.controlsPoints.map(a => a.weight))
            mesh.allCalculatedPoints = res
            bSplineParam.setPoints(res)
            mesh.isError = false

        } catch (e) {
            mesh.isError = true
            throw new Error(e.message)
        }
    }


    return mesh
}

function createBezier(controlsPoints) {

    const geometry = new BufferGeometry().setFromPoints([]);

    const material = new MeshLineMaterial({
        color: Constant.DEFAULT_COLOR_CURVE,
        lineWidth: 0.04,
        sizeAttenuation: true,

    });

    const bSplineParam = new MeshLine(geometry, material);
    const mesh = new THREE.Mesh(bSplineParam, material);
    mesh.raycast = MeshLineRaycast;
    mesh.name = Constant.DEFAULT_NAME_BEZIER
    increaseDefaultName("Bezier")
    mesh.type = "Bezier"
    mesh.controlsPoints = []
    mesh.childrenID = []
    mesh.resolution = 100
    mesh.isError = true
    mesh.allCalculatedPoints = []

    if (controlsPoints) {
        try {
            let allPositionControlsPoints = controlsPoints.map(a => a.position);

            let res = bezierCurve(allPositionControlsPoints,mesh.resolution = 100)
            mesh.allCalculatedPoints = res
            bSplineParam.setPoints(res)
            mesh.isError = false
            mesh.controlsPoints = controlsPoints


            controlsPoints.forEach((controls) => {
                controls.childrenID.push(mesh.id)
            })

        } catch (e) {
            console.log(e.message)
            throw new Error("Error in creation bezier")
        }
    }
    mesh.update = () => {
        let allControlsPoints = mesh.controlsPoints.map(a => a.position);
        try {
            let res = bezierCurve(allControlsPoints,mesh.resolution)
            mesh.allCalculatedPoints = res
            bSplineParam.setPoints(res)
            mesh.isError = false

        } catch (e) {
            mesh.isError = true
            throw new Error(e.message)
        }
    }


    return mesh
}

function createMirroredCurve(initialCurve, axis) {

    const geometry = new BufferGeometry().setFromPoints([]);

    const material = new MeshLineMaterial({
        color: Constant.DEFAULT_COLOR_CURVE,
        lineWidth: 0.04,
        sizeAttenuation: true,

    });

    const line = new MeshLine(geometry, material);
    const mesh = new THREE.Mesh(line, material);
    mesh.raycast = MeshLineRaycast;
    mesh.name = Constant.DEFAULT_NAME_MIRRORED_CURVE
    increaseDefaultName("Mirrored Curve")
    mesh.type = "Mirrored Curve"
    mesh.initialCurve = null
    mesh.axis = null
    mesh.childrenID = []
    mesh.isError = true
    mesh.allCalculatedPoints = []


    if (initialCurve && axis) {
        try {

            let points = mirrorCurve([...initialCurve.allCalculatedPoints], axis.value)


            mesh.allCalculatedPoints = points
            line.setPoints(points)
            mesh.isError = false
            mesh.initialCurve = initialCurve
            mesh.axis = axis
            initialCurve.childrenID.push(mesh.id)

        } catch (e) {
            console.log(e)
        }
    }

    mesh.update = () => {
        try {
            let points = mirrorCurve(mesh.initialCurve.allCalculatedPoints, mesh.axis.value)
            mesh.allCalculatedPoints = points
            line.setPoints(points)
            mesh.isError = false;

        } catch (e) {
            mesh.isError = true;
            throw new Error(e.message)
        }
    }

    return mesh
}


function createCSpline() {


    const geometry = new BufferGeometry().setFromPoints([]);

    const material = new MeshLineMaterial({
        color: Constant.DEFAULT_COLOR_CURVE,
        lineWidth: 0.04,
        sizeAttenuation: true,

    });

    const line = new MeshLine(geometry, material);
    const mesh = new THREE.Mesh(line, material);
    mesh.raycast = MeshLineRaycast;
    mesh.name = Constant.DEFAULT_NAME_C_SPLINE
    increaseDefaultName("C-Spline")
    mesh.type = "C-Spline"
    mesh.controlsPoints = []
    mesh.allCalculatedPoints = []
    mesh.childrenID = []
    mesh.closed = false;
    mesh.resolution = 100
    mesh.isError = true


    mesh.update = () => {
        let allControlsPoints = mesh.controlsPoints.map(a => a.position);

        try {
            let res = cSpline(allControlsPoints, mesh.resolution, mesh.closed)
            mesh.allCalculatedPoints = res
            line.setPoints(res)
            mesh.isError = false;

        } catch (e) {
            mesh.isError = true;
            throw new Error(e.message)
        }
    }


    return mesh

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


    surface.update = () => {
        let pointFirstCurve = surface.firstCurve.allCalculatedPoints
        let pointSecondCurve = surface.secondCurve.allCalculatedPoints

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
        if (object.type === "Point" || object.type === "Mirrored Point") {
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
        } else if (object.type === "NURBS") {
            if (currentObject == null || (currentObject.id !== object.id)) {

                let intersect = object


                return intersect;

            } else {
                return currentObject
            }
        }
        else if (object.type === "Bezier") {
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
    createNURBS,
    createBezier
}

