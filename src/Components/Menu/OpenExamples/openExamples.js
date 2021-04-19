import React from "react";
import {MenuItem, SubMenu} from "rc-menu";
import sardinetteSTL from "../../../STL/sardinette.stl"
import {importSTLFromFile} from "../../../Misc/Import";


export default function OpenExamples(props) {


    const handleClickSardinette = ()=>{
        importSTLFromFile(sardinetteSTL,props.scene,props.setAllObject)

    }

    return (
        <SubMenu popupOffset={[0, 2]} {...props} title="Examples">
            <MenuItem onClick={handleClickSardinette}>
                Sardinette
            </MenuItem>

        </SubMenu>
    )

}

