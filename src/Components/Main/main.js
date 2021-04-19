import Menu from "../Menu/menu";
import React, {useCallback, useEffect, useRef} from "react";
import useStyles from "./style";
import Toolbar from "../Toolbar/toolbar";
import Scene from "../Scene/scene";
import AllObjectAndGlobalSettings from "../AllObjectAndGlobalSettings/allObjectAndGlobalSettings";
import CurrentObject from "../CurrentObject/currentObject";
import Background from "../../Misc/Background";
import {createPoint, modifyObjectWhenClickOn, updateChildren} from "../../Misc/Utils";
import Modal from "@material-ui/core/Modal";
import {Button, Typography} from "@material-ui/core";
import AxisView from "../AxisView/axisView";
import {createAxis,createCatmullRomSpline,createNURBS,createBSpline,createBezier,createMirroredCurve,createSurface,createLoftSurface} from "../../Misc/Utils";


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


    useEffect(() => {



            const xAxis = createAxis('x')
         const yAxis = createAxis('y')
         const zAxis = createAxis('z')

         const firstPoint = createPoint({x: 0, y: 2, z: 2});
         const secondPoint = createPoint({x: 0, y: 0, z: 2});
         const thirdPoint = createPoint({x: 0, y: 0, z: 0});

         const firstBSpline = createBSpline([firstPoint,secondPoint,thirdPoint]);

         const fourthPoint = createPoint({x: 2, y: 2, z: 2});
         const fifthPoint = createPoint({x: 2, y: 0, z: 2});
         const sixthPoint = createPoint({x: 2, y: 0, z: 0});

         const firstBezier = createBezier([fourthPoint,fifthPoint,sixthPoint]);

         const seventhPoint = createPoint({x: 4, y: 2, z: 2});
         const eigthPoint = createPoint({x: 4, y: 0, z: 2});
         const ninthPoint = createPoint({x: 4, y: 0, z: 0});

         const firstCSpline = createCatmullRomSpline([seventhPoint,eigthPoint,ninthPoint]);

         const mirrorFirstBSpline = createMirroredCurve(firstBSpline,yAxis);
         const mirrorFirstBezier= createMirroredCurve(firstBezier,yAxis);
         const mirrorFirstCSpline= createMirroredCurve(firstCSpline,yAxis);


         const tenPoint = createPoint({x: 6, y: 2, z: 2});
         const elevenPoint = createPoint({x: 6, y: 0, z: 2});
         const twelvePoint = createPoint({x: 6, y: 0, z: 0});

         const createFirstNURBS= createNURBS([tenPoint,elevenPoint,twelvePoint]);

         const firstSurface= createSurface(firstBezier,firstBSpline);


         const thirteenPoint = createPoint({x: 0, y: 2, z: -4});
         const fourteenPoint = createPoint({x: 0, y: 0, z: -4});
         const fifteenPoint = createPoint({x: 0, y: 0, z: -2});

         const sixteen = createPoint({x: 2, y: 2, z: -6});
         const seventeen = createPoint({x: 2, y: 0, z: -6});
         const eighteen = createPoint({x: 2, y: 0, z: -4});

         const nineteen = createPoint({x: 4, y: 2, z: -4});
         const twenty = createPoint({x: 4, y: 0, z: -4});
         const twentyOne = createPoint({x: 4, y: 0, z: -2});


         const secondCSpline = createCatmullRomSpline([thirteenPoint,fourteenPoint,fifteenPoint])
         const thirdCSpline = createCatmullRomSpline([sixteen,seventeen,eighteen])
         const fourthCSpline = createCatmullRomSpline([nineteen,twenty,twentyOne])


         const cLoft = createLoftSurface([secondCSpline,thirdCSpline,fourthCSpline])


         setAllObject([
             firstPoint,secondPoint,thirdPoint,firstBSpline,
             fourthPoint,fifthPoint,sixthPoint,firstBezier,
             seventhPoint,eigthPoint,ninthPoint,firstCSpline,
             mirrorFirstBSpline,mirrorFirstBezier,mirrorFirstCSpline,
             tenPoint,elevenPoint,twelvePoint,createFirstNURBS,
             firstSurface,
             thirteenPoint,fourteenPoint,fifteenPoint,
             sixteen,seventeen,eighteen,
             nineteen,twenty,twentyOne,
             secondCSpline,thirdCSpline,fourthCSpline,
             cLoft
         ])

        /*    const top1 = createPoint({x: 0, y: 2, z: 2});
            const top2 = createPoint({x: 2, y: 2, z: 0})
            const top3 = createPoint({x: 2, y: 2, z: 2})

            const firstCurve = createCSpline([top1,top2,top3])*/




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
            <Menu scene={scene} setAllObject={setAllObject}>

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

