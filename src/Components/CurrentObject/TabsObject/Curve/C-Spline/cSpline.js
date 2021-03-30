import React from "react";
import {Typography} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import useStyles from "./style";
import PropTypes from "prop-types";
import {modificationCSpline} from "../../../../../Class/Utils";
import {useSnackbar} from 'notistack';

CSpline.propType = {
    setCurrentObject: PropTypes.func.isRequired,
    currentObject: PropTypes.object.isRequired,
    allObject: PropTypes.array.isRequired,
    updateAllObjectWhenCurrentObjectChange: PropTypes.func.isRequired,
    setCurrentTextFieldSelected: PropTypes.func.isRequired,
    updateObjectByAddingChildrenID:PropTypes.func.isRequired,
}


export default function CSpline(props) {

    const classes = useStyles()

    const {enqueueSnackbar} = useSnackbar();

    const [name, setName] = React.useState(props.currentObject.name);
    const [isVisible, setIsVisible] = React.useState(props.currentObject.visible);

    const [resolution, setResolution] = React.useState(props.currentObject.resolution);

    const [closed, setClosed] = React.useState(props.currentObject.closed);

    const [controlsPoints, setControlsPoints] = React.useState(props.currentObject.controlsPoints);


    React.useEffect((() => {
        setResolution(props.currentObject.resolution)
        setIsVisible(props.currentObject.visible)
        setName(props.currentObject.name)
        setControlsPoints(props.currentObject.controlsPoints)
        setClosed(props.currentObject.closed)
    }), [props.currentObject])

    const handleChangeIsVisible = (event) => {
        setIsVisible(event.target.checked);
        let lastValue = props.currentObject;
        let newValue = props.currentObject
        newValue.visible = event.target.checked;
        props.updateAllObjectWhenCurrentObjectChange(lastValue, newValue,false)
        props.setCurrentObject(newValue)
    }

    const handleChangeClosed = (event) => {
        setClosed(event.target.checked);
        let lastValue = props.currentObject;
        let newValue = props.currentObject
        newValue.closed = event.target.checked;
        let res = modificationCSpline(newValue)
        newValue.geometry = res
        props.updateAllObjectWhenCurrentObjectChange(lastValue, newValue,true)
        props.setCurrentObject(newValue)
    }

    const handleChangeTextFieldName = (event) => {
        setName(event.target.value);
    }

    const blurTextFieldName = (event) => {
        setName(props.currentObject.name);
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


    const keyPressTextFieldControlsPoints = (e) => {
        if (e.keyCode === 13) {
            let lastValue = props.currentObject;
            let newValue = props.currentObject
            newValue.controlsPoints = controlsPoints
            try {
                let res = modificationCSpline(newValue)
                newValue.geometry = res
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
                let res = modificationCSpline(newValue)
                newValue.geometry = res
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
            acceptType:["Point","Mirrored Point"],
            clickCtrl : addControlsPoints,
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
                    Resolution
                </Typography>
                <TextField value={resolution} onKeyDown={keyPressTextFieldResolution}
                           onChange={handleChangeTextFieldResolution}
                           InputProps={{className: classes.inputSmallTextField}}/>

            </div>
            <div className={classes.containerRow}>
                <Typography className={classes.text}>
                    Closed
                </Typography>
                <Checkbox
                    className={classes.checkBox}
                    checked={closed}
                    color="primary"
                    onChange={handleChangeClosed}
                />
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

