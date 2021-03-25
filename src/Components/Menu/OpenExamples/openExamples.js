import React from "react";
import {MenuItem, SubMenu} from "rc-menu";


export default function OpenExamples(props) {

    return (
        <SubMenu popupOffset={[0,2]} {...props} title="Examples">
            <MenuItem>
               Sardinette
            </MenuItem>

        </SubMenu>
    )

}

