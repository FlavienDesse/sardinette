import React from "react";
import {MenuItem, SubMenu} from "rc-menu"
import {exportSTL} from "../../../Class/Export";
import PropTypes from "prop-types";



OpenFile.propType = {
    scene:PropTypes.any.isRequired,
    setAllObject: PropTypes.func.isRequired,
}

export default function OpenFile(props) {



    const handleClickOnSTL = ()=>{
        exportSTL(props.scene)
    }

    return (
        <SubMenu  popupOffset={[0,2]} {...props} title={"File"}>
            <SubMenu title={"Import"} >

            </SubMenu>
            <SubMenu popupOffset={[0, 2]} title={"Export"} >
                <MenuItem onClick={handleClickOnSTL}>
                    STL
                </MenuItem>
            </SubMenu>
        </SubMenu>
    )

}

