import React from "react";
import PropTypes from 'prop-types';
import {createBSpline, createPoint} from "../../../Class/Utils"
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

    const handleAddBSpline = () => {
        props.setAllObject((prevState) => {
            let curve = createBSpline()

            prevState.push(curve)

            return [...prevState]

        })
    }

    let propsSubMenu = Object.assign({}, props)
    delete  propsSubMenu.setAllObject

    return (
        <SubMenu popupOffset={[0, 2]} {...propsSubMenu} title="Insert">
            <SubMenu popupOffset={[0, 0]} title={"Point"}>
                <MenuItem onClick={handleAddPoint}>
                    Point
                </MenuItem>
                <MenuItem>
                    Mirrored Point
                </MenuItem>
            </SubMenu>
            <SubMenu popupOffset={[0, 2]} title={"Curve"}>
                <MenuItem onClick={handleAddBSpline}>
                    B-Spline
                </MenuItem>
                <MenuItem>
                    C-Spline
                </MenuItem>
            </SubMenu>
            <SubMenu popupOffset={[0, 2]} title={"Surfaces"}>
                <MenuItem>
                    C-Surfaces
                </MenuItem>
            </SubMenu>
        </SubMenu>
    )


}
