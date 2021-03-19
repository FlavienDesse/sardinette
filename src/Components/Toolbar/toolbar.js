import React from "react";
import useStyles from "./style";

import icons_cube_front_view from "../../Images/Icons/cube_front_view.png"
import icons_cube_left_view from "../../Images/Icons/cube_left_view.png"
import icons_cube_top_view from "../../Images/Icons/cube_top_view.png"
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';

export default function Toolbar() {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <div className={classes.section}>
                <img alt={"front view"} src={icons_cube_front_view}/>
                <img alt={"left view"} src={icons_cube_left_view}/>
                <img alt={"top view"} src={icons_cube_top_view}/>
            </div>
            <div className={classes.section}>
                <ZoomInIcon fontSize="large"/>
                <ZoomOutIcon fontSize="large"/>
            </div>
        </div>
    )

}