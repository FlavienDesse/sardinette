import Menu from "../Menu/menu";
import React from "react";
import useStyles from "./style";
import Toolbar from "../Toolbar/toolbar";
import Scene from "../Scene/scene";
import AllObject from "../AllObject/allObject";
import CurrentObject from "../CurrentObject/currentObject";

export default function Main() {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <Menu/>
            <Toolbar/>
            <div className={classes.containerSceneAndBoxObject}>
                <div className={classes.containerScene}>
                    <Scene/>
                </div>
                <div>
                    <div>
                        <AllObject/>
                    </div>
                    <div>
                        <CurrentObject/>
                    </div>
                </div>
            </div>

        </div>
    );
}

