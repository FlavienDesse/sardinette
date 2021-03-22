import Menu from "../Menu/menu";
import React from "react";
import useStyles from "./style";
import Toolbar from "../Toolbar/toolbar";
import Scene from "../Scene/scene";
import AllObjectAndGlobalSettings from "../AllObjectAndGlobalSettings/AllObjectAndGlobalSettings";
import CurrentObject from "../CurrentObject/currentObject";
import Background from "../../Class/Background";

export default function Main() {
    const classes = useStyles();

    const [currentObject,setCurrentObject] = React.useState(null)
    const [allObject,setAllObject] = React.useState([])
    const [background,setBackground] = React.useState(new Background(null,true));



    return (
        <div className={classes.container}>
            <Menu setAllObject={setAllObject}/>

            <Toolbar/>
            <div className={classes.containerSceneAndBoxObject}>
                <div className={classes.containerScene}>
                    <Scene background={background} setCurrentObject={setCurrentObject} currentObject={currentObject} allObject={allObject}/>
                </div>
                <div className={classes.containerToolsObject}>
                    <AllObjectAndGlobalSettings  setBackground={setBackground}/>
                    {
                        currentObject && <CurrentObject currentObject={currentObject} setCurrentObject={setCurrentObject}/>
                    }

                </div>
            </div>

        </div>
    );
}

