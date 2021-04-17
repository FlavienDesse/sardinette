import React from "react";
import PropTypes from 'prop-types';
import {
    createBezier,
    createBSpline, createLoftSurface,
    createCatmullRomSpline,
    createMirroredCurve,
    createMirroredPoint,
    createNURBS,
    createPoint,
    createSurface
} from "../../../Misc/Utils"
import {MenuItem, SubMenu} from "rc-menu";


OpenInsert.propType = {

    setAllObject: PropTypes.func.isRequired,
}


export default function OpenInsert(props) {

    const handleAddPoint = () => {
        props.setAllObject((prevState) => {

            let point = createPoint()

            prevState.push(point)

            return [...prevState]
        })
    }

    const handleAddSurface = () => {
        props.setAllObject((prevState) => {

            let surface = createSurface()

            prevState.push(surface)

            return [...prevState]
        })
    }

    const handleAddBSpline = () => {
        props.setAllObject((prevState) => {
            let curve = createBSpline()

            prevState.push(curve)

            return [...prevState]

        })
    }

    const handleAddCSpline = () => {
        props.setAllObject((prevState) => {
            let curve = createCatmullRomSpline()

            prevState.push(curve)

            return [...prevState]

        })
    }

    const handleAddMirroredPoint = () => {
        props.setAllObject((prevState) => {
            let mirroredPoint = createMirroredPoint()

            prevState.push(mirroredPoint)

            return [...prevState]

        })
    }

    const handleAddMirroredCurve = () => {
        props.setAllObject((prevState) => {
            let mirroredCurve = createMirroredCurve()

            prevState.push(mirroredCurve)

            return [...prevState]

        })
    }
    const handleAddNURBS = () => {
        props.setAllObject((prevState) => {
            let nurbs = createNURBS()

            prevState.push(nurbs)

            return [...prevState]

        })
    }

    const handleAddBezier= () => {
        props.setAllObject((prevState) => {
            let bezier = createBezier()

            prevState.push(bezier)

            return [...prevState]

        })
    }

    const handleAddCLoftSurface= () => {
        props.setAllObject((prevState) => {
            let surface = createLoftSurface()

            prevState.push(surface)

            return [...prevState]

        })
    }

    let propsSubMenu = Object.assign({}, props)
    delete propsSubMenu.setAllObject


    return (
        <SubMenu popupOffset={[0, 2]} {...propsSubMenu} title="Insert">
            <SubMenu popupOffset={[0, 0]} title={"Point"}>
                <MenuItem onClick={handleAddPoint}>
                    Point
                </MenuItem>
                <MenuItem onClick={handleAddMirroredPoint}>
                    Mirrored Point
                </MenuItem>
            </SubMenu>
            <SubMenu popupOffset={[0, 2]} title={"Curve"}>
                <MenuItem onClick={handleAddBezier}>
                    Bezier
                </MenuItem>
                <MenuItem onClick={handleAddNURBS}>
                    NURBS
                </MenuItem>
                <MenuItem onClick={handleAddBSpline}>
                    B-Spline
                </MenuItem>
                <MenuItem onClick={handleAddCSpline}>
                    Catmull Rom Spline
                </MenuItem>
                <MenuItem onClick={handleAddMirroredCurve}>
                    Mirrored Curve
                </MenuItem>
            </SubMenu>
            <SubMenu popupOffset={[0, 2]} title={"Surfaces"}>
                <MenuItem onClick={handleAddSurface}>
                    Surface
                </MenuItem>
                <MenuItem onClick={handleAddCLoftSurface}>
                    Loft Surface
                </MenuItem>
            </SubMenu>
        </SubMenu>
    )


}

