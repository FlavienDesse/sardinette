import React from "react";
import {Typography} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import useStyles from "./style";
import PropTypes from "prop-types";
import {modificationBSpline} from "../../../../../Class/Utils";
import {useSnackbar} from 'notistack';
import {BufferGeometry} from "three";

BSpline.propType = {
    setCurrentObject: PropTypes.func.isRequired,
    currentObject: PropTypes.object.isRequired,
    allObject: PropTypes.array.isRequired,
    updateAllObjectWhenCurrentObjectChange: PropTypes.func.isRequired,
    setCurrentTextFieldSelected: PropTypes.func.isRequired,
    updateObjectByAddingChildrenID:PropTypes.func.isRequired,
}


export default function BSpline(props) {

    const classes = useStyles()

    const {enqueueSnackbar} = useSnackbar();

    const [name, setName] = React.useState(props.currentObject.name);
    const [isVisible, setIsVisible] = React.useState(props.currentObject.visible);

    const [resolution, setResolution] = React.useState(props.currentObject.resolution);
    const [degree, setDegree] = React.useState(props.currentObject.degree);

    const [controlsPoints, setControlsPoints] = React.useState(props.currentObject.controlsPoints);


    React.useEffect((() => {
        setResolution(props.currentObject.resolution)
        setIsVisible(props.currentObject.visible)
        setName(props.currentObject.name)
        setDegree(props.currentObject.degree)
        setControlsPoints(props.currentObject.controlsPoints)
    }), [props.currentObject])

    const handleChangeIsVisible = (event) => {
        setIsVisible(event.target.checked);
        let lastValue = props.currentObject;
        let newValue = props.currentObject
        newValue.visible = event.target.checked;
        props.updateAllObjectWhenCurrentObjectChange(lastValue, newValue,false)
        props.setCurrentObject(newValue)
    }

    const handleChangeTextFieldName = (event) => {
        setName(event.target.value);
    }

    const blurTextFieldName = (event) => {
        setName(props.currentObject.name);
    }

    const blurTextFieldDegree= (event) => {
        setDegree(props.currentObject.degree);
    }

    const handleChangeTextFieldDegree = (event) => {
        var rgx = /[0-9]*/;
        let val = event.target.value.match(rgx)

        if( event.target.value=== "" || val[0] === "" ){
            setDegree("");
        }
        else{
            setDegree(parseInt(val[0]));
        }
    }

    const handleChangeTextFieldResolution = (event) => {
        var rgx = /[0-9]*/;
        let val = event.target.value.match(rgx)

        if( event.target.value=== "" || val[0] === "" ){
            setResolution("");
        }
        else{
            setResolution(parseInt(val[0]));
        }
    }

    const keyPressTextFieldName = (e) => {
        if (e.keyCode === 13) {
            if(name === ""){
                enqueueSnackbar("name can't be empty", {
                    variant: 'error',
                });
            }
            else{
                let lastValue = props.currentObject;
                let newValue = props.currentObject
                newValue.name = name
                props.updateAllObjectWhenCurrentObjectChange(lastValue, newValue,false)
                props.setCurrentObject(newValue)
            }

        }
    }

    const keyPressTextFieldDegree = (e) => {
        if (e.keyCode === 13) {
            let lastValue = props.currentObject;
            let newValue = props.currentObject
            newValue.degree = degree
            try {
                let res = modificationBSpline(newValue)
                newValue.geometry =  new BufferGeometry().setFromPoints(res);
                newValue.allCalculatedPoints = res
                newValue.isError = false;
                props.updateAllObjectWhenCurrentObjectChange(lastValue, newValue,true)
                props.setCurrentObject(newValue)
            } catch (e) {
                enqueueSnackbar(e.message, {
                    variant: 'error',
                });
                newValue.isError = true;
                props.updateAllObjectWhenCurrentObjectChange(lastValue, newValue,false)
                props.setCurrentObject(newValue)
            }
        }
    }

    const keyPressTextFieldControlsPoints = (e) => {
        if (e.keyCode === 13) {
            let lastValue = props.currentObject;
            let newValue = props.currentObject
            newValue.controlsPoints = controlsPoints
            try {
                let res = modificationBSpline(newValue)
                newValue.allCalculatedPoints = res
                newValue.geometry =  new BufferGeometry().setFromPoints(res);
                newValue.isError = false;
                props.updateObjectByAddingChildrenID(controlsPoints,props.currentObject.id)
                props.updateAllObjectWhenCurrentObjectChange(lastValue, newValue,true)
                props.setCurrentObject(newValue)
            } catch (e) {
                enqueueSnackbar(e.message, {
                    variant: 'error',
                });
                newValue.isError = true;
                props.updateAllObjectWhenCurrentObjectChange(lastValue, newValue,false)
                props.setCurrentObject(newValue)
            }


        }
    }

    const keyPressTextFieldResolution = (e) => {
        if (e.keyCode === 13) {
            let lastValue = props.currentObject;
            let newValue = props.currentObject
            newValue.resolution = resolution
            try {
                let res = modificationBSpline(newValue)
                newValue.geometry =  new BufferGeometry().setFromPoints(res);
                newValue.allCalculatedPoints = res
                newValue.isError = false;
                props.updateAllObjectWhenCurrentObjectChange(lastValue, newValue,true)
                props.setCurrentObject(newValue)
            } catch (e) {
                enqueueSnackbar(e.message, {
                    variant: 'error',
                });
                newValue.isError = true;
                props.updateAllObjectWhenCurrentObjectChange(lastValue, newValue,false)
                props.setCurrentObject(newValue)
            }
        }
    }


    const handleFocusOnTextFieldControlsPoints = (e) => {
        setControlsPoints([])
        props.setCurrentTextFieldSelected({
            id:props.currentObject.id,
            acceptType:["Point","Mirrored Point"],
            clickCtrl: addControlsPoints,
            simpleClick: setOneControlsPoints
        })
    }

    const handleDisFocusOnTextFieldControlsPoints = (e) => {

        props.setCurrentTextFieldSelected(null)
        setControlsPoints(props.currentObject.controlsPoints)
    }

    const addControlsPoints = (points) => {
        setControlsPoints((prevState) => {
            prevState.push(points)

            return [...prevState]
        })

    }

    const setOneControlsPoints = (points) => {
        setControlsPoints((prevState) => {
            prevState = []
            prevState.push(points)
            return [...prevState]
        })
    }

    return (
        <div>
            <div className={classes.containerRow}>
                <Typography className={classes.text}>
                    Name
                </Typography>
                <TextField value={name} onBlur={blurTextFieldName} onKeyDown={keyPressTextFieldName} onChange={handleChangeTextFieldName}
                           InputProps={{className: classes.inputTextField}}/>
            </div>

            <div className={classes.containerRow}>
                <Typography className={classes.text}>
                    Controls Points
                </Typography>
                <TextField

                    value={
                        controlsPoints.map(a => a.name)
                    }

                    error={controlsPoints.length < 2}
                    helperText={controlsPoints.length < 2 && "Please enter at least 2 points"}
                    onKeyDown={keyPressTextFieldControlsPoints} onBlur={handleDisFocusOnTextFieldControlsPoints}
                    onFocus={handleFocusOnTextFieldControlsPoints} InputProps={{className: classes.inputTextField}}/>

            </div>

            <div className={classes.containerRow}>
                <Typography className={classes.text}>
                    Degree
                </Typography>
                <TextField value={degree} onBlur={blurTextFieldDegree} onKeyDown={keyPressTextFieldDegree} onChange={handleChangeTextFieldDegree}
                           InputProps={{className: classes.inputSmallTextField}}/>

            </div>

            <div className={classes.containerRow}>
                <Typography className={classes.text}>
                    Resolution
                </Typography>
                <TextField value={resolution} onKeyDown={keyPressTextFieldResolution}
                           onChange={handleChangeTextFieldResolution}
                           InputProps={{className: classes.inputSmallTextField}}/>

            </div>

            <div className={classes.containerRow}>
                <Typography className={classes.text}>
                    Visible
                </Typography>
                <Checkbox
                    className={classes.checkBox}
                    checked={isVisible}
                    color="primary"
                    onChange={handleChangeIsVisible}
                />
            </div>

        </div>
    )
}

