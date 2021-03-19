import React from "react";

import useStyles from "./style";
import MenuItem from "@material-ui/core/MenuItem";



export default function OpenFile(props) {

    const classes = useStyles();

    return (
        <div className={classes.container}>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>

        </div>
    )

}

