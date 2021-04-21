import Menu from "../Menu/menu";
import React, {useCallback, useEffect, useRef} from "react";
import useStyles from "./style";
import Toolbar from "../Toolbar/toolbar";
import Scene from "../Scene/scene";
import AllObjectAndGlobalSettings from "../AllObjectAndGlobalSettings/allObjectAndGlobalSettings";
import CurrentObject from "../CurrentObject/currentObject";
import Background from "../../Misc/Background";
import {
    createAxis, createCatmullRomSpline, createLoftSurface,
    createMirroredCurve, createMirroredPoint,
    createNURBS,
    createPoint, createSurface,
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

    const controls = useRef();
    const control = useRef();
    const camera = useRef();
    const renderer = useRef();
    const scene = useRef();
    const raycaster = useRef();




    const createPipe= ()=>{
        const yAxis = createAxis('y')

        const firstPointsFirstCircle = createPoint({
            position: {x: 1, y: 1, z: 0},
            weight: 1,
        });
        const secondPointFirstCircle = createPoint({
            position: {x: 0, y: 1, z: 0},
            weight: 1 / 2,
        });
        const thirdPointFirstCircle = createPoint({
            position: {x: 1 / 2, y: 1.86, z: 0},
            weight: 1,
        });

        const fourthPointsFirstCircle = createPoint({
            position: {x: 1, y: 2.73, z: 0},
            weight: 1 / 2,
        });
        const fifthPointFirstCircle = createPoint({
            position: {x: 3 / 2, y: 1.86, z: 0},
            weight: 1,
        });
        const sixthPointFirstCircle = createPoint({
            position: {x: 2, y: 1, z: 0}, weight: 1 / 2,
        });
        const seventhPointsFirstCircle = createPoint({
            position: {x: 1, y: 1, z: 0}, weight: 1,
        });

        const firstCircle = createNURBS({
            controlsPoints: [firstPointsFirstCircle, secondPointFirstCircle, thirdPointFirstCircle, fourthPointsFirstCircle, fifthPointFirstCircle, sixthPointFirstCircle, seventhPointsFirstCircle],
            knots : [0,0,0,1/3,1/3,2/3,2/3,1,1,1],
            degree:2
        })




        const firstPointsSecondCircle = createPoint({
            position: {x: 1, y: 1, z: 2},
            weight: 1,
        });
        const secondPointSecondCircle= createPoint({
            position: {x: 0, y: 1, z: 2},
            weight: 1 / 2,
        });
        const thirdPointSecondCircle = createPoint({
            position: {x: 1 / 2, y: 1.86, z: 2.5},
            weight: 1,
        });

        const fourthPointsSecondCircle = createPoint({
            position: {x: 1, y: 2.73, z: 3},
            weight: 1 / 2,
        });
        const fifthPointSecondCircle = createPoint({
            position: {x: 3 / 2, y: 1.86, z: 2.5},
            weight: 1,
        });
        const sixthPointSecondCircle = createPoint({
            position: {x: 2, y: 1, z: 2}, weight: 1 / 2,
        });
        const seventhPointsSecondCircle = createPoint({
            position: {x: 1, y: 1, z: 2}, weight: 1,
        });

        const secondCircle = createNURBS({
            controlsPoints: [firstPointsSecondCircle, secondPointSecondCircle, thirdPointSecondCircle, fourthPointsSecondCircle, fifthPointSecondCircle, sixthPointSecondCircle, seventhPointsSecondCircle],
            knots : [0,0,0,1/3,1/3,2/3,2/3,1,1,1],
            degree:2
        })





        const firstPointsThirdCircle = createPoint({
            position: {x: 1, y: 0, z: 3},
            weight: 1,
        });
        const secondPointThirdCircle= createPoint({
            position: {x: 0, y: 0, z: 3},
            weight: 1 / 2,
        });
        const thirdPointThirdCircle = createPoint({
            position: {x: 1 / 2, y: 0, z:4.36},
            weight: 1,
        });

        const fourthPointsThirdCircle = createPoint({
            position: {x: 1, y: 0, z: 5.73},
            weight: 1 / 2,
        });
        const fifthPointThirdCircle = createPoint({
            position: {x: 3 / 2, y: 0, z:4.36},
            weight: 1,
        });
        const sixthPointThirdCircle = createPoint({
            position: {x: 2, y: 0, z: 3}, weight: 1 / 2,
        });
        const seventhPointsThirdCircle = createPoint({
            position: {x: 1, y: 0, z: 3}, weight: 1,
        });

        const thirdCircle = createNURBS({
            controlsPoints: [firstPointsThirdCircle, secondPointThirdCircle, thirdPointThirdCircle, fourthPointsThirdCircle, fifthPointThirdCircle, sixthPointThirdCircle, seventhPointsThirdCircle],
            knots : [0,0,0,1/3,1/3,2/3,2/3,1,1,1],
            degree:2
        })


        const mirroredCurveFirstCircle = createMirroredCurve(firstCircle,yAxis)
        const mirroredCurveSecondCircle= createMirroredCurve(secondCircle,yAxis)


        const loftSurface = createLoftSurface([firstCircle,secondCircle,thirdCircle,mirroredCurveSecondCircle,mirroredCurveFirstCircle])

        setAllObject([
            firstPointsFirstCircle, secondPointFirstCircle, thirdPointFirstCircle, fourthPointsFirstCircle, fifthPointFirstCircle, sixthPointFirstCircle, seventhPointsFirstCircle, firstCircle,
            firstPointsSecondCircle, secondPointSecondCircle, thirdPointSecondCircle, fourthPointsSecondCircle, fifthPointSecondCircle, sixthPointSecondCircle, seventhPointsSecondCircle, secondCircle,
            firstPointsThirdCircle, secondPointThirdCircle, thirdPointThirdCircle, fourthPointsThirdCircle, fifthPointThirdCircle, sixthPointThirdCircle, seventhPointsThirdCircle, thirdCircle,
            mirroredCurveFirstCircle,mirroredCurveSecondCircle,
            loftSurface
        ])
    }

    const createSardinette = ()=>{


        const xAxis = createAxis("x")


        const firstPoint = createPoint({
            position: {x: 3.77, y: 0, z: 0},
            weight: 1,
        });
        const secondPoint = createPoint({
            position: {x: 5.17, y: -0.82, z: 11.81},
            weight: 1 / 2,
        });
        const thirdPoint = createPoint({
            position: {x: 0.39, y: 0.73, z: 21.18},
            weight: 1,
        });


        const firstCatmullRom = createCatmullRomSpline([firstPoint,secondPoint,thirdPoint])
        const firstMirrorCurve = createMirroredCurve(firstCatmullRom,xAxis)
        const firstSurface = createSurface(firstCatmullRom,firstMirrorCurve)


        const fourthPoint = createPoint({
            position: {x: 4.53, y: 3.26, z: -0.80},
            weight: 1,
        });
        const fifthPoint = createPoint({
            position: {x: 5.63, y: 3.05, z: 11.73},
            weight: 1 / 2,
        });
        const sixthPoint = createPoint({
            position: {x:1.14, y: 3.96, z: 22.38},
            weight: 1,
        });

        const secondCatmullRom = createCatmullRomSpline([fourthPoint,fifthPoint,sixthPoint])
        const secondMirrorCurve = createMirroredCurve(secondCatmullRom,xAxis)


        const secondSurface = createSurface(firstCatmullRom,secondCatmullRom)
        const thirdSurface = createSurface(firstMirrorCurve,secondMirrorCurve)




        const seventhPoint = createMirroredPoint(firstPoint,xAxis)
        const eigthPoint = createMirroredPoint(fourthPoint,xAxis)

        const thirdCatmullRom = createCatmullRomSpline([firstPoint,seventhPoint])
        const fourthCatmullRom = createCatmullRomSpline([fourthPoint,eigthPoint])

        const fourthSurface = createSurface(thirdCatmullRom,fourthCatmullRom)




        const ninthPoint = createMirroredPoint(thirdPoint,xAxis)
        const tenPoint = createMirroredPoint(sixthPoint,xAxis)

        const fifthCatmullRom = createCatmullRomSpline([thirdPoint,ninthPoint])
        const sixthCatmullRom = createCatmullRomSpline([sixthPoint,tenPoint])

        const fifthSurface = createSurface(fifthCatmullRom,sixthCatmullRom)


        setAllObject([
            firstPoint,secondPoint,thirdPoint,firstCatmullRom,firstMirrorCurve,firstSurface,fourthPoint,secondCatmullRom,secondMirrorCurve,
            secondSurface,thirdSurface,fifthPoint,sixthPoint,
            seventhPoint,eigthPoint,thirdCatmullRom,fourthCatmullRom,fourthSurface,
            fifthCatmullRom,sixthCatmullRom,fifthSurface,
            ninthPoint,tenPoint
        ])



    }

    useEffect(() => {


        //createPipe()
        //createSardinette()


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
                if (currentObject.userData.childrenID.includes(prev.id)) {
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
            } else if (keyCode === "Delete" && currentObject.userData.type !== "Axis") {

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
                Are you sure you want to delete {currentObject != null ? currentObject.userData.name : ""} ?
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
            <Menu scene={scene} setAllObject={setAllObject} setCurrentObject={setCurrentObject}>

            </Menu>

            <Modal
                open={openModalDeleteObject}
                onClose={handleClose}

            >
                {body}

            </Modal>

            <Toolbar controls={controls.current} camera={camera.current} currentObject={currentObject}/>
            <div className={classes.containerSceneAndBoxObject}>
                <div className={classes.containerScene}>
                    <Scene controls={controls} control={control} camera={camera} renderer={renderer} scene={scene}
                           raycaster={raycaster}
                           updateAllObjectWhenCurrentObjectChange={updateAllObjectWhenCurrentObjectChange}
                           currentTextFieldSelected={currentTextFieldSelected}
                           setCurrentTextFieldSelected={setCurrentTextFieldSelected} background={background}
                           setCurrentObject={setCurrentObject} currentObject={currentObject}
                           allObject={allObject}/>


                    {
                        camera.current ? <AxisView controls={control.current} camera={camera.current}/> : ""
                    }


                </div>
                <div className={classes.containerToolsObject}>
                    <AllObjectAndGlobalSettings currentTextFieldSelected={currentTextFieldSelected}
                                                currentObject={currentObject} setCurrentObject={setCurrentObject}
                                                updateAllObjectWhenCurrentObjectChange={updateAllObjectWhenCurrentObjectChange}
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

