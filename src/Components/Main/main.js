import Menu from "../Menu/menu";
import React, {useCallback, useEffect} from "react";
import useStyles from "./style";
import Toolbar from "../Toolbar/toolbar";
import Scene from "../Scene/scene";
import AllObjectAndGlobalSettings from "../AllObjectAndGlobalSettings/allObjectAndGlobalSettings";
import CurrentObject from "../CurrentObject/currentObject";
import Background from "../../Class/Background";

export default function Main() {
    const classes = useStyles();

    const [currentObject, setCurrentObject] = React.useState(null)
    const [allObject, setAllObject] = React.useState([])
    const [background, setBackground] = React.useState(new Background(null, true));

    /*
       This hook is useful when the user clicks on a textField where we must enter values (like points)
     */
    const [currentTextFieldSelected, setCurrentTextFieldSelected] = React.useState(null);


    const  callBackKeys = useCallback((e => {
        let keyCode = e.key;
        if (currentObject != null) {

            if (keyCode === "Escape") {

                setCurrentObject((prevState) => {

                    prevState.scale.x = prevState.currentScale.x
                    prevState.scale.y = prevState.currentScale.y
                    prevState.scale.z = prevState.currentScale.z

                    return null
                })
            }
        }

    }), [currentObject])

    useEffect(() => {

        document.addEventListener('keydown', callBackKeys)

        return (() => document.removeEventListener('keydown', callBackKeys));

    }, [callBackKeys])


    //Normally the array allObject is updated when we change the value of currentObject , because currentObject is a reference of one item in the array
    //But we have to do this to refresh all component
    const updateAllObjectWhenCurrentObjectChange = (lastValue, newValue) => {
        const index = allObject.findIndex(value => value.id === lastValue.id)
        setAllObject(prevState => {
            prevState[index] = newValue
            return [...prevState]
        })


    }

    return (
        <div className={classes.container}>
            <Menu setAllObject={setAllObject}/>

            <Toolbar/>
            <div className={classes.containerSceneAndBoxObject}>
                <div className={classes.containerScene}>
                    <Scene currentTextFieldSelected={currentTextFieldSelected} setCurrentTextFieldSelected={setCurrentTextFieldSelected} background={background} setCurrentObject={setCurrentObject} currentObject={currentObject}
                           allObject={allObject}/>
                </div>
                <div className={classes.containerToolsObject}>
                    <AllObjectAndGlobalSettings  currentObject={currentObject} setCurrentObject={setCurrentObject} setAllObject={setAllObject} allObject={allObject}
                                                setBackground={setBackground}/>
                    {
                        currentObject && <CurrentObject setCurrentTextFieldSelected={setCurrentTextFieldSelected} allObject={allObject}
                                                        updateAllObjectWhenCurrentObjectChange={updateAllObjectWhenCurrentObjectChange}
                                                        currentObject={currentObject}
                                                        setCurrentObject={setCurrentObject}/>
                    }

                </div>
            </div>

        </div>
    );
}

