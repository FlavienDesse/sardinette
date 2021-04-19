import * as THREE from "three";
import {BufferGeometry, DoubleSide, Mesh, MeshBasicMaterial, SphereGeometry} from "three";
import Constant from "./Constant";
import {bezierCurve, bSpline, loftSurface, catmullRomSpline, getSurface, mirrorCurve, mirrorPoint} from "./Math";
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
        case "Catmull Rom Spline":
            matches = Constant.DEFAULT_NAME_CATMULL_ROM_SPLINE.match(reg);
            Constant.DEFAULT_NAME_CATMULL_ROM_SPLINE = Constant.DEFAULT_NAME_CATMULL_ROM_SPLINE.replace(reg, parseInt(matches[0], 10) + 1)
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
        case "Loft Surface":
            matches = Constant.DEFAULT_NAME_LOFT_SURFACE.match(reg);
            Constant.DEFAULT_NAME_LOFT_SURFACE = Constant.DEFAULT_NAME_LOFT_SURFACE.replace(reg, parseInt(matches[0], 10) + 1)
            break;
        default:

            throw new Error("unknow type provided "+type)
    }
}

const updateObjectByAddingChildrenID = (allUpdatedObject, id, allObject, setAllObject) => {






    let allIDUpdated = allUpdatedObject.map(prev => prev.id)




    let newState = allObject.map(prev => {
        if (allIDUpdated.includes(prev.id) && !prev.userData.childrenID.includes(id)) {
            prev.userData.childrenID.push(id)
        }
        return prev
    })


    setAllObject(newState)
}

function updateChildren(allObject, currentObject, isDeletion) {

    let allChildrenInfo = []


    currentObject.userData.childrenID.forEach((id) => {
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
                    const index = obj.userData.childrenID.indexOf(value.id);
                    if (index > -1) {
                        obj.userData.childrenID.splice(index, 1);
                    }
                })
            } else {
                if (prev.userData.type === "B-Spline" || prev.userData.type === "C-Spline" || prev.userData.type === "C-Spline" || prev.userData.type === "Bezier") {
                    if (isDeletion) {
                        prev.userData.controlsPoints = prev.userData.controlsPoints.filter(controlsPoints => controlsPoints.id !== currentObject.id)
                    }

                } else if (prev.userData.type === "Mirrored Point") {
                    if (isDeletion) {
                        prev.userData.initialPoint = null;
                    }

                } else if (prev.userData.type === "Mirrored Curve") {
                    if (isDeletion) {
                        prev.userData.initialCurve = null;
                    }

                } else if (prev.userData.type === "Surface") {
                    if (isDeletion) {
                        if(prev.userData.firstCurve.id === currentObject.id){
                            prev.userData.firstCurve = null;
                        }
                        else{
                            prev.userData.secondCurve = null;
                        }

                    }

                } else if (prev.userData.type === "loftSurface") {
                    if (isDeletion) {
                        prev.userData.allCurves = prev.userData.allCurves.filter(curve => curve.id !== curve.id)
                    }

                }


                if (value.isError) {
                    prev.isError = true
                } else {
                    try {
                        prev.userData.update()
                    } catch (e) {

                    }
                }

                prev.userData.childrenID.forEach((id) => {
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


    let tempAxis = {userData:{}};


    switch (axis) {
        case 'x':
            tempAxis.userData.name = "X Axis"
            tempAxis.userData.value = "x";
            break
        case 'y':


            tempAxis.userData.name = "Y Axis"
            tempAxis.userData.value = "y";
            break
        case 'z':


            tempAxis.userData.name = "Z Axis"
            tempAxis.userData.value = "z";
            break
        default:
            throw new Error("axis type undefined")
    }
    tempAxis.userData.visible = false;
    tempAxis.userData.type = "Axis"
    tempAxis.userData.isError = false
    tempAxis.userData.lock = true
    tempAxis.userData.childrenID = []
    return tempAxis


}

function createMirroredPoint(initialPoint, axis) {
    const geometry = new SphereGeometry(Constant.DEFAULT_SIZE_POINT, 32, 32);
    let material = new MeshBasicMaterial({color: Constant.DEFAULT_COLOR_POINT});
    const point = new Mesh(geometry, material);
    point.userData.type = "Mirrored Point"
    point.userData.name = Constant.DEFAULT_NAME_MIRRORED_POINT
    increaseDefaultName("Mirrored Point")
    point.userData.isError = true
    point.userData.initialPoint = null
    point.userData.axis = null
    point.userData.weight = 1
    point.userData.childrenID = []


    point.userData.update = () => {


        try {


            if(point.userData.axis === null){
                 throw new Error("axis is null")
            }


            let res = mirrorPoint([point.userData.initialPoint.position.x, point.userData.initialPoint.position.y, point.userData.initialPoint.position.z], point.userData.axis.userData.value)
            point.position.set(res[0], res[1], res[2])

            point.userData.isError = false
        } catch (e) {
            point.userData.isError = true
            throw new Error(e.message)
        }

    }

    if (initialPoint && axis) {
        point.userData.axis = axis
        point.userData.initialPoint = initialPoint
        initialPoint.userData.childrenID.push(point.id)
        point.userData.update()
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


    point.userData.type = "Point"

    point.userData.name = Constant.DEFAULT_NAME_POINT
    increaseDefaultName("Point")
    point.isError = false
    point.userData.weight = 1
    point.userData.childrenID = []


    point.userData.update = () => {

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

    mesh.userData.name = Constant.DEFAULT_NAME_NURBS
    increaseDefaultName("NURBS")
    mesh.userData.type = "NURBS"
    mesh.userData.controlsPoints = []
    mesh.userData.childrenID = []
    mesh.userData.degree = 2
    mesh.userData.resolution = 15
    mesh.userData.isError = true
    mesh.userData.allCalculatedPoints = []
    mesh.userData.knots = new Array( mesh.userData.degree + 1).fill().map((_, index) => index + 1);

    if (controlsPoints) {

        try {
            let allPositionControlsPoints = controlsPoints.map(a => a.position);

            mesh.userData.knots = new Array( allPositionControlsPoints.length+mesh.userData.degree + 1).fill().map((_, index) => index + 1);
            let res = bSpline(mesh.userData.degree, allPositionControlsPoints, mesh.userData.resolution, mesh.userData.knots, controlsPoints.map(a => a.userData.weight))

            mesh.userData.allCalculatedPoints = res
            line.setPoints(res)

            mesh.userData.isError = false
            mesh.userData.controlsPoints = controlsPoints


            controlsPoints.forEach((controls) => {
                controls.userData.childrenID.push(mesh.id)
            })

        } catch (e) {
            console.log(e.message)
            throw new Error("Error in creation NURBS")
        }
    }


    mesh.userData.update = () => {

        let allControlsPoints = mesh.userData.controlsPoints.map(a => a.position);
        try {
            let res = bSpline(mesh.userData.degree, allControlsPoints, mesh.userData.resolution, mesh.userData.knots, mesh.userData.controlsPoints.map(a => a.userData.weight))
            mesh.userData.allCalculatedPoints = res
            line.setPoints(res)
            mesh.userData.isError = false

        } catch (e) {
            mesh.userData.isError = true
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
    mesh.userData.name = Constant.DEFAULT_NAME_B_SPLINE
    increaseDefaultName("B-Spline")
    mesh.userData.type = "B-Spline"
    mesh.userData.controlsPoints = []
    mesh.userData.childrenID = []
    mesh.userData.degree = 2
    mesh.userData.resolution = 16
    mesh.userData.isError = true
    mesh.userData.allCalculatedPoints = []

    if (controlsPoints) {
        try {
            let allPositionControlsPoints = controlsPoints.map(a => a.position);

            let res = bSpline(mesh.userData.degree, allPositionControlsPoints, mesh.userData.resolution, null, controlsPoints.map(a => a.userData.weight))

            mesh.userData.allCalculatedPoints = res
            bSplineParam.setPoints(res)
            mesh.userData.isError = false
            mesh.userData.controlsPoints = controlsPoints


            controlsPoints.forEach((controls) => {
                controls.userData.childrenID.push(mesh.id)
            })

        } catch (e) {
            console.log(e.message)
            throw new Error("Error in creation b spline")
        }
    }
    mesh.userData.update = () => {
        let allControlsPoints = mesh.userData.controlsPoints.map(a => a.position);
        try {
            let res = bSpline(mesh.userData.degree, allControlsPoints, mesh.userData.resolution, null, mesh.userData.controlsPoints.map(a => a.userData.weight))

            console.log(mesh.userData.degree)
            console.log(mesh.userData.resolution)

            mesh.userData.allCalculatedPoints = res
            bSplineParam.setPoints(res)
            mesh.userData.isError = false

        } catch (e) {
            mesh.userData.isError = true
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

    const beizer = new MeshLine(geometry, material);
    const mesh = new THREE.Mesh(beizer, material);
    mesh.raycast = MeshLineRaycast;
    mesh.userData.name = Constant.DEFAULT_NAME_BEZIER
    increaseDefaultName("Bezier")
    mesh.userData.type = "Bezier"
    mesh.userData.controlsPoints = []
    mesh.userData.childrenID = []
    mesh.userData.resolution = 15
    mesh.userData.isError = true
    mesh.userData.allCalculatedPoints = []

    if (controlsPoints) {
        try {
            let allPositionControlsPoints = controlsPoints.map(a => a.position);

            let res = bezierCurve(allPositionControlsPoints, mesh.userData.resolution)
            mesh.userData.allCalculatedPoints = res
            beizer.setPoints(res)
            mesh.userData.isError = false
            mesh.userData.controlsPoints = controlsPoints


            controlsPoints.forEach((controls) => {
                controls.userData.childrenID.push(mesh.id)
            })

        } catch (e) {
            console.log(e.message)
            throw new Error("Error in creation bezier")
        }
    }
    mesh.userData.update = () => {
        let allControlsPoints = mesh.userData.controlsPoints.map(a => a.position);
        try {
            let res = bezierCurve(allControlsPoints, mesh.userData.resolution)
            mesh.userData.allCalculatedPoints = res
            beizer.setPoints(res)
            mesh.userData.isError = false

        } catch (e) {
            mesh.userData.isError = true
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
    mesh.userData.name = Constant.DEFAULT_NAME_MIRRORED_CURVE
    increaseDefaultName("Mirrored Curve")
    mesh.userData.type = "Mirrored Curve"
    mesh.userData.initialCurve = null
    mesh.userData.axis = null
    mesh.userData.childrenID = []
    mesh.userData.isError = true
    mesh.userData.allCalculatedPoints = []


    if (initialCurve && axis) {
        try {

            let points = mirrorCurve([...initialCurve.userData.allCalculatedPoints], axis.userData.value)


            mesh.userData.allCalculatedPoints = points
            line.setPoints(points)
            mesh.userData.isError = false
            mesh.userData.initialCurve = initialCurve
            mesh.userData.axis = axis
            initialCurve.userData.childrenID.push(mesh.id)

        } catch (e) {
            console.log(e)
        }
    }

    mesh.userData.update = () => {
        try {
            let points = mirrorCurve(mesh.userData.initialCurve.userData.allCalculatedPoints, mesh.userData.axis.userData.value)
            mesh.userData.allCalculatedPoints = points
            line.setPoints(points)
            mesh.userData.isError = false;

        } catch (e) {
            mesh.userData.isError = true;
            throw new Error(e.message)
        }
    }

    return mesh
}

function createCatmullRomSpline(controlsPoints) {


    const geometry = new BufferGeometry().setFromPoints([]);

    const material = new MeshLineMaterial({
        color: Constant.DEFAULT_COLOR_CURVE,
        lineWidth: 0.04,
        sizeAttenuation: true,

    });

    const line = new MeshLine(geometry, material);
    const mesh = new THREE.Mesh(line, material);
    mesh.raycast = MeshLineRaycast;
    mesh.userData.name = Constant.DEFAULT_NAME_CATMULL_ROM_SPLINE
    increaseDefaultName("Catmull Rom Spline")
    mesh.userData.type = "Catmull Rom Spline"
    mesh.userData.controlsPoints = []
    mesh.userData.allCalculatedPoints = []
    mesh.userData.childrenID = []
    mesh.userData.closed = false;
    mesh.userData.resolution = 15
    mesh.userData.isError = true


    if (controlsPoints) {
        try {
            let allControlsPoints = controlsPoints.map(a => a.position);
            let res = catmullRomSpline(allControlsPoints, mesh.userData.resolution, mesh.userData.closed)
            mesh.userData.allCalculatedPoints = res
            line.setPoints(res)
            mesh.userData.isError = false
            mesh.userData.controlsPoints = controlsPoints


            controlsPoints.forEach((controls) => {
                controls.userData.childrenID.push(mesh.id)
            })

        } catch (e) {
            console.log(e.message)
            throw new Error("Error in creation c spline")
        }
    }
    mesh.userData.update = () => {
        let allControlsPoints = mesh.userData.controlsPoints.map(a => a.position);

        try {
            let res = catmullRomSpline(allControlsPoints, mesh.userData.resolution, mesh.userData.closed)
            mesh.userData.allCalculatedPoints = res
            line.setPoints(res)
            mesh.userData.isError = false;

        } catch (e) {
            mesh.userData.isError = true;
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

    surface.userData.name = Constant.DEFAULT_NAME_SURFACE
    increaseDefaultName("Surface")
    surface.userData.type = "Surface"

    surface.userData.childrenID = []
    surface.userData.firstCurve = null
    surface.userData.secondCurve = null

    surface.userData.isError = true


    if (firstCurve && secondCurve) {

        try {

            surface.children.push(line)

            let pointFirstCurve = []
            let pointSecondCurve = []



            for(let i = 0 ; i < firstCurve.userData.allCalculatedPoints.length ; i+=3){
                pointFirstCurve.push({
                    x: firstCurve.userData.allCalculatedPoints[i],
                    y: firstCurve.userData.allCalculatedPoints[i+1],
                    z: firstCurve.userData.allCalculatedPoints[i+2],
                })
            }

            for(let i = 0 ; i < secondCurve.userData.allCalculatedPoints.length ; i+=3){
                pointSecondCurve.push({
                    x: secondCurve.userData.allCalculatedPoints[i],
                    y: secondCurve.userData.allCalculatedPoints[i+1],
                    z: secondCurve.userData.allCalculatedPoints[i+2],
                })
            }



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


            surface.userData.firstCurve = firstCurve
            surface.userData.secondCurve = secondCurve
            surface.userData.isError = false

            firstCurve.userData.childrenID.push(surface.id);
            secondCurve.userData.childrenID.push(surface.id);

            // line.geometry=geometry

            surface.geometry = geometry



        } catch (e) {
            console.log(e)
            throw new Error("error in creation surface")
        }
    }


    surface.userData.update = () => {

        try {
            let pointFirstCurve = []
            let pointSecondCurve = []


            let isEmpty = true
            // eslint-disable-next-line no-native-reassign
            for( let _ in surface.userData.secondCurve ){
                isEmpty = false
                break;
            }
            if(isEmpty){
                throw new Error("second curve is undefined")
            }
            isEmpty = true
            for(let _ in surface.userData.firstCurve ){
                isEmpty = false
                break;
            }
            if(isEmpty){
                throw new Error("first curve is undefined")
            }






            for(let i = 0 ; i < surface.userData.firstCurve.userData.allCalculatedPoints.length ; i+=3){
                pointFirstCurve.push({
                    x:  surface.userData.firstCurve.userData.allCalculatedPoints[i],
                    y:  surface.userData.firstCurve.userData.allCalculatedPoints[i+1],
                    z:  surface.userData.firstCurve.userData.allCalculatedPoints[i+2],
                })
            }

            for(let i = 0 ; i < surface.userData.secondCurve.userData.allCalculatedPoints.length ; i+=3){
                pointSecondCurve.push({
                    x: surface.userData.secondCurve.userData.allCalculatedPoints[i],
                    y: surface.userData.secondCurve.userData.allCalculatedPoints[i+1],
                    z: surface.userData.secondCurve.userData.allCalculatedPoints[i+2],
                })
            }

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
            surface.userData.isError = false
        } catch (e) {
            surface.userData.isError = true
            throw new Error(e.message)
        }

    }


    return surface

}


function createSTL(geometry){

    const material = new MeshBasicMaterial({
        color: Constant.DEFAULT_COLOR_SURFACE,
        opacity: 0.5,
        transparent: true,
        side: THREE.DoubleSide
    });
    const mesh = new Mesh(geometry, material);

    mesh.userData.type = "Import STL"
    mesh.userData.name = "ImportSTL"

    return mesh;
}

function createLoftSurface(curves) {


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

    surface.userData.name = Constant.DEFAULT_NAME_LOFT_SURFACE
    increaseDefaultName("Loft Surface")
    surface.userData.type = "Loft Surface"
    surface.userData.resolution = 5
    surface.userData.childrenID = []
    surface.userData.allCurves = []


    surface.userData.isError = true


    if (curves) {
        try {



            const allVector3Curves = []
            for (let j = 0; j < curves.length; j++) {
                let curve = curves[j]
                surface.userData.allCurves.push(curve)
                curve.userData.childrenID.push(surface.id);
                allVector3Curves.push([])
                for (let i = 0; i < curve.userData.allCalculatedPoints.length; i+=3) {

                    allVector3Curves[j].push(new THREE.Vector3(
                        curve.userData.allCalculatedPoints[i],
                        curve.userData.allCalculatedPoints[i+1],
                        curve.userData.allCalculatedPoints[i+2]

                    ))
                }
            }


            let res = loftSurface(allVector3Curves,  surface.userData.resolution)

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


            surface.userData.isError = false



            // line.geometry=geometry

            surface.geometry = geometry

        } catch (e) {
            console.log(e)
        }
    }


    surface.userData.update = () => {

        let allVector3Curves = []

        for (let j = 0; j <  surface.userData.allCurves.length; j++) {
            let curve =surface.userData.allCurves[j]
            allVector3Curves.push([])
            for (let i = 0; i < curve.userData.allCalculatedPoints.length; i+=3) {

                allVector3Curves[j].push(new THREE.Vector3(
                    curve.userData.allCalculatedPoints[i],
                    curve.userData.allCalculatedPoints[i+1],
                    curve.userData.allCalculatedPoints[i+2]

                ))
            }
        }





        try {
            let res = loftSurface(allVector3Curves, surface.userData.resolution)


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
            surface.userData.isError = false
        } catch (e) {
            surface.userData.isError = true
            throw new Error(e.message)
        }

    }


    return surface

}

function modifyObjectWhenClickOn(object, currentObject) {


    if (currentObject != null && (object == null || (currentObject.id !== object.id))) {
        if (currentObject.userData.type === "Point" || currentObject.userData.type === "Mirrored Point") {

            currentObject.scale.x = currentObject.currentScale.x
            currentObject.scale.y = currentObject.currentScale.y
            currentObject.scale.z = currentObject.currentScale.z
        }

    }


    if (object != null) {
        if (object.userData.type === "Point" || object.userData.type === "Mirrored Point") {
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
        } else if (object.userData.type === "B-Spline") {
            if (currentObject == null || (currentObject.id !== object.id)) {

                let intersect = object

                return intersect;

            } else {
                return currentObject
            }
        } else if (object.userData.type === "Catmull Rom Spline") {
            if (currentObject == null || (currentObject.id !== object.id)) {

                let intersect = object

                return intersect;

            } else {
                return currentObject
            }
        } else if (object.userData.type === "Surface") {
            if (currentObject == null || (currentObject.id !== object.id)) {

                let intersect = object


                return intersect;

            } else {
                return currentObject
            }
        } else if (object.userData.type === "Axis") {
            if (currentObject == null || (currentObject.id !== object.id)) {

                let intersect = object


                return intersect;

            } else {
                return currentObject
            }
        } else if (object.userData.type === "Mirrored Curve") {
            if (currentObject == null || (currentObject.id !== object.id)) {

                let intersect = object


                return intersect;

            } else {
                return currentObject
            }
        } else if (object.userData.type === "NURBS") {
            if (currentObject == null || (currentObject.id !== object.id)) {

                let intersect = object


                return intersect;

            } else {
                return currentObject
            }
        } else if (object.userData.type === "Bezier") {
            if (currentObject == null || (currentObject.id !== object.id)) {

                let intersect = object


                return intersect;

            } else {
                return currentObject
            }
        }else if (object.userData.type === "Loft Surface") {
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
    createCatmullRomSpline,
    createAxis,
    createMirroredPoint,
    createMirroredCurve,
    updateObjectByAddingChildrenID,
    createNURBS,
    createBezier,
    createLoftSurface,
    createSTL,
}

