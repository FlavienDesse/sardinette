import React from "react";
import MenuItemMaterialUI from "@material-ui/core/MenuItem";
import {MenuItem, SubMenu} from "rc-menu";


export default function OpenView(props) {

    return (
        <SubMenu title={"Example"}>
            <MenuItem>
                <MenuItemMaterialUI value={10}>Ten</MenuItemMaterialUI>
            </MenuItem>
        </SubMenu>
    )

}

