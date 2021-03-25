import React from "react";

import useStyles from "./style";
import MenuItemMaterialUI from "@material-ui/core/MenuItem";
import MenuRC, {MenuItem, SubMenu} from "rc-menu"


export default function OpenFile(props) {



    return (
        <SubMenu  popupOffset={[0,2]} {...props} title={"File"}>
            <SubMenu title={"Import"}>

            </SubMenu>
            <SubMenu title={"Export"}>

            </SubMenu>
        </SubMenu>
    )

}

