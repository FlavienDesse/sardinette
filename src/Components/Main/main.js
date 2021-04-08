import Menu from "../Menu/menu";
import React, {useCallback, useEffect, useRef} from "react";
import useStyles from "./style";
import Toolbar from "../Toolbar/toolbar";
import Scene from "../Scene/scene";
import AllObjectAndGlobalSettings from "../AllObjectAndGlobalSettings/allObjectAndGlobalSettings";
import CurrentObject from "../CurrentObject/currentObject";
import Background from "../../Misc/Background";
import {
    createAxis,
    createBSpline,
    createMirroredCurve, createMirroredPoint,
    createPoint,
    createSurface,
    modifyObjectWhenClickOn,
    updateChildren
} from "../../Misc/Utils";
import Modal from "@material-ui/core/Modal";
import {Button, Typography} from "@material-ui/core";
import AxisView from "../AxisView/axisView";

export default function Main() {
    const classes = useStyles();

    const [currentObject, setCurrentObject] = React.useState(null)
    const [allObject, setAllObject] = React.useState([])
    const [background, setBackground] = React.useState(new Background("#a0a0a0", false));
    const [openModalDeleteObject, setModalDeleteObject] = React.useState(false);

    const [numberElemDelete, setNumberElemDelete] = React.useState(0);

    /*
       This hook is useful when the user clicks on a textField where we must enter values (like points)
     */
    const [currentTextFieldSelected, setCurrentTextFieldSelected] = React.useState(null);

    const control = useRef();
    const camera = useRef();
    const renderer = useRef();
    const scene = useRef();
    const raycaster = useRef();

    useEffect(() => {


        const axisX = createAxis("x")
        const axisY = createAxis("y")
        const axisZ = createAxis("z")


        const firstPoint = createPoint({x: 0, y: 2, z: 2});
        const secondPoint = createPoint({x: 2, y: 2, z: 0})
        const mirrorFirstPoint = createMirroredPoint(firstPoint, axisZ)

        const firstCurve = createBSpline([firstPoint, secondPoint, mirrorFirstPoint])

        const mirrorFirstCurve = createMirroredCurve(firstCurve, axisY)
        const surface = createSurface(firstCurve, mirrorFirstCurve)
        /*  const firstPoint = createPoint({x:0,y:2,z:2});
          const secondPoint=createPoint({x:2,y:2,z:0})

          const thirdPoint=createPoint({x:0,y:0,z:0});



          const mirrorFirstCurve = createMirroredCurve(firstCurve,axisY)

         const surface = createSurface(firstCurve,mirrorFirstCurve)*/


        //setAllObject([axisX,axisY,axisZ,firstPoint,secondPoint,thirdPoint])
        setAllObject([ firstPoint, mirrorFirstPoint, secondPoint, firstCurve, mirrorFirstCurve, surface])

    }, [])


    //Normally the array allObject is updated when we change the value of currentObject , because currentObject is a reference of one item in the array
    //But we have to do this to refresh all component


    //TODO lastValue to id
    const updateAllObjectWhenCurrentObjectChange = (lastValue, newValue, haveToRecalculateChildren) => {
        const index = allObject.findIndex(value => value.id === lastValue.id)
        setAllObject(prevState => {
            if (haveToRecalculateChildren) {
                prevState[index] = newValue
                let res = updateChildren(allObject, prevState[index], false)
                return [...res]
            } else {
                prevState[index] = newValue
                return [...prevState]

            }
        })
    }


    const callBackKeys = useCallback((e) => {

        const deleteTheCurrentObject = () => {
            let allIDImpacted = []
            allObject.forEach((prev) => {
                if (currentObject.childrenID.includes(prev.id)) {
                    allIDImpacted.push(prev.id)

                }
            })
            setNumberElemDelete(allIDImpacted.length)
            handleOpen()
        }

        let keyCode = e.key;
        if (currentObject != null) {

            if (keyCode === "Escape") {
                modifyObjectWhenClickOn(null, currentObject)
                setCurrentTextFieldSelected(null)
                setCurrentObject(null)
            } else if (keyCode === "Delete" && currentObject.type !== "Axis") {

                deleteTheCurrentObject()


            }
        }

    }, [allObject, currentObject])

    useEffect(() => {

        document.addEventListener('keydown', callBackKeys)

        return (() => document.removeEventListener('keydown', callBackKeys));

    }, [callBackKeys])

    const callbackDeleteTheCurrentObject = () => {

        let res = updateChildren(allObject, currentObject, true).filter(item => item.id !== currentObject.id)
        setAllObject(res)
        setCurrentObject(null)
        handleClose()
    }


    const handleOpen = () => {
        setModalDeleteObject(true);
    };

    const handleClose = () => {
        setModalDeleteObject(false);
    };


    const body = (
        <div className={classes.paper}>
            <Typography variant={"body1"}>
                Are you sure you want to delete {currentObject != null ? currentObject.name : ""} ?
            </Typography>
            <Typography variant={"body1"}>
                {numberElemDelete} object(s) will be impacted
            </Typography>
            <div className={classes.containerButton}>
                <Button className={classes.buttonModal} variant={"contained"} color={"secondary"} onClick={handleClose}>
                    Close
                </Button>
                <Button className={classes.buttonModal} variant={"contained"} color={"primary"}
                        onClick={callbackDeleteTheCurrentObject}>
                    Accept
                </Button>
            </div>

        </div>
    )


    return (
        <div className={classes.container}>
            <Menu scene={scene.current} setAllObject={setAllObject}>

            </Menu>

            <Modal
                open={openModalDeleteObject}
                onClose={handleClose}

            >
                {body}

            </Modal>

            <Toolbar/>
            <div className={classes.containerSceneAndBoxObject}>
                <div className={classes.containerScene}>
                    <Scene control={control} camera={camera} renderer={renderer} scene={scene} raycaster={raycaster}
                           updateAllObjectWhenCurrentObjectChange={updateAllObjectWhenCurrentObjectChange}
                           currentTextFieldSelected={currentTextFieldSelected}
                           setCurrentTextFieldSelected={setCurrentTextFieldSelected} background={background}
                           setCurrentObject={setCurrentObject} currentObject={currentObject}
                           allObject={allObject}/>


                    {
                        camera.current ?    <AxisView controls={control.current} camera={camera.current}/> : ""
                    }





                </div>
                <div className={classes.containerToolsObject}>
                    <AllObjectAndGlobalSettings currentTextFieldSelected={currentTextFieldSelected}
                                                currentObject={currentObject} setCurrentObject={setCurrentObject}
                                                setAllObject={setAllObject} allObject={allObject}
                                                setBackground={setBackground}/>
                    {
                        currentObject && <CurrentObject
                            setAllObject={setAllObject}
                            setCurrentTextFieldSelected={setCurrentTextFieldSelected}
                            allObject={allObject}
                            updateAllObjectWhenCurrentObjectChange={updateAllObjectWhenCurrentObjectChange}
                            currentObject={currentObject}
                            setCurrentObject={setCurrentObject}/>
                    }

                </div>
            </div>

        </div>
    );
}

