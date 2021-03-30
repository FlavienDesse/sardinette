import Menu from "../Menu/menu";
import React, {useCallback, useEffect} from "react";
import useStyles from "./style";
import Toolbar from "../Toolbar/toolbar";
import Scene from "../Scene/scene";
import AllObjectAndGlobalSettings from "../AllObjectAndGlobalSettings/allObjectAndGlobalSettings";
import CurrentObject from "../CurrentObject/currentObject";
import Background from "../../Class/Background";
import {createPoint, modifyObjectWhenClickOn, updateChildren} from "../../Class/Utils";
import Modal from "@material-ui/core/Modal";
import {Button, Typography} from "@material-ui/core";

export default function Main() {
    const classes = useStyles();

    const [currentObject, setCurrentObject] = React.useState(null)
    const [allObject, setAllObject] = React.useState([createPoint(), createPoint(), createPoint()])
    const [background, setBackground] = React.useState(new Background(null, true));
    const [openModalDeleteObject, setModalDeleteObject] = React.useState(false);

    const [numberElemDelete, setNumberElemDelete] = React.useState(0);

    /*
       This hook is useful when the user clicks on a textField where we must enter values (like points)
     */
    const [currentTextFieldSelected, setCurrentTextFieldSelected] = React.useState(null);







    //Normally the array allObject is updated when we change the value of currentObject , because currentObject is a reference of one item in the array
    //But we have to do this to refresh all component
    const updateAllObjectWhenCurrentObjectChange = (lastValue, newValue , haveToRecalculateChildren) => {
        const index = allObject.findIndex(value => value.id === lastValue.id)
        setAllObject(prevState => {

            if(haveToRecalculateChildren){
                prevState[index] = newValue
                let res = updateChildren(allObject,prevState[index],false)
                return [...res]
            }
            else{
                prevState[index] = newValue
                return [...prevState]

            }
        })
    }

    const updateObjectByAddingChildrenID = (allUpdatedObject, id) => {

        let allIDUpdated = allUpdatedObject.map(prev => prev.id)

        let newState = allObject.map(prev => {
            if (allIDUpdated.includes(prev.id) && !prev.childrenID.includes(prev.id)) {
                prev.childrenID.push(id )

            }
            return prev
        })


        setAllObject(newState)
    }



    const callBackKeys = useCallback((e) => {

        const deleteTheCurrentObject = () => {
            let number = 0;
            allObject.forEach((prev)=> {
                if( currentObject.childrenID.includes(prev.id) ){
                    number++
                }
            })
            setNumberElemDelete(number)
            handleOpen()
        }

        let keyCode = e.key;
        if (currentObject != null) {

            if (keyCode === "Escape") {
                modifyObjectWhenClickOn(null, currentObject)
                setCurrentObject(null)
            } else if (keyCode === "Delete") {
                updateChildren(allObject, currentObject,true)
                deleteTheCurrentObject()


            }
        }

    }, [allObject,currentObject])

    useEffect(() => {

        document.addEventListener('keydown', callBackKeys)

        return (() => document.removeEventListener('keydown', callBackKeys));

    }, [callBackKeys])

    const callbackDeleteTheCurrentObject = () => {

        let res = updateChildren(allObject, currentObject,true).filter(item => item.id !== currentObject.id)
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
        <div  className={classes.paper}>
            <Typography variant={"body1"}>
                Are you sure you want to delete {currentObject != null ? currentObject.name : ""} ?
            </Typography>
            <Typography variant={"body1"}>
                {numberElemDelete } object(s) will be impacted
            </Typography>
            <div className={classes.containerButton}>
                <Button className={classes.buttonModal} variant={"contained"} color={"secondary"} onClick={handleClose}>
                    Close
                </Button>
                <Button className={classes.buttonModal} variant={"contained"} color={"primary"} onClick={callbackDeleteTheCurrentObject}>
                    Accept
                </Button>
            </div>

        </div>
    )


    return (
        <div className={classes.container}>
            <Menu setAllObject={setAllObject}>

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
                    <Scene updateAllObjectWhenCurrentObjectChange={updateAllObjectWhenCurrentObjectChange} currentTextFieldSelected={currentTextFieldSelected}
                           setCurrentTextFieldSelected={setCurrentTextFieldSelected} background={background}
                           setCurrentObject={setCurrentObject} currentObject={currentObject}
                           allObject={allObject}/>
                </div>
                <div className={classes.containerToolsObject}>
                    <AllObjectAndGlobalSettings currentTextFieldSelected={currentTextFieldSelected}
                                                currentObject={currentObject} setCurrentObject={setCurrentObject}
                                                setAllObject={setAllObject} allObject={allObject}
                                                setBackground={setBackground}/>
                    {
                        currentObject && <CurrentObject updateObjectByAddingChildrenID={updateObjectByAddingChildrenID}
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

