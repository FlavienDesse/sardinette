import React from "react";
import MenuItemMaterialUI from "@material-ui/core/MenuItem";
import Menu from '@material-ui/core/Menu';
import PropTypes from 'prop-types';
import {Typography} from "@material-ui/core";
import useStyles from "./style";
import Select from "@material-ui/core/Select";
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

