import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from '@material-ui/core/Menu';
import PropTypes from 'prop-types';
import {Typography} from "@material-ui/core";
import useStyles from "./style";
import Select from "@material-ui/core/Select";



export default function OpenView(props) {

    const classes = useStyles();
    return (
        <div className={classes.container}>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>

        </div>
    )


}

