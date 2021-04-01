import React from "react";
import useStyles from "../../Point/MirroredPoint/style";
import {useSnackbar} from "notistack";
import {modificationMirroredCurve} from "../../../../../Class/Utils";
import {Typography} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import PropTypes from "prop-types";
import {BufferGeometry, Vector3} from "three";

MirroredCurve.propType = {
    setCurrentObject: PropTypes.func.isRequired,
    currentObject: PropTypes.object.isRequired,
    allObject: PropTypes.array.isRequired,
    updateAllObjectWhenCurrentObjectChange: PropTypes.func.isRequired
}


export default function MirroredCurve(props) {
    const classes = useStyles();

    const {enqueueSnackbar} = useSnackbar();


    const [name, setName] = React.useState(props.currentObject.name);
    const [isVisible, setIsVisible] = React.useState(props.currentObject.visible);

    const [initialCurve, setInitialCurve] = React.useState(props.currentObject.initialCurve);

    const [axis, setAxis] = React.useState(props.currentObject.axis);


    React.useEffect((() => {
        setIsVisible(props.currentObject.visible)
        setName(props.currentObject.name)
        setInitialCurve(props.currentObject.initialCurve)
    }), [props.currentObject])


    const blurTextFieldName = (event) => {
        setName(props.currentObject.name);
    }

    const handleChangeIsVisible = (event) => {
        setIsVisible(event.target.checked);
        let lastValue = props.currentObject;
        let newValue = props.currentObject
        newValue.visible = event.target.checked;
        props.updateAllObjectWhenCurrentObjectChange(lastValue, newValue, false)
        props.setCurrentObject(newValue)
    }

    const handleChangeTextFieldName = (event) => {
        setName(event.target.value);
    }


    const keyPressTextFieldName = (e) => {
        if (e.keyCode === 13) {
            if (name === "") {
                enqueueSnackbar("name can't be empty", {
                    variant: 'error',
                });
            } else {
                let lastValue = props.currentObject;
                let newValue = props.currentObject
                newValue.name = name
                props.updateAllObjectWhenCurrentObjectChange(lastValue, newValue, false)
                props.setCurrentObject(newValue)
            }

        }
    }


    const keyPressTextFieldAxis = (e) => {
        if (e.keyCode === 13) {
            let lastValue = props.currentObject;
            let newValue = props.currentObject
            newValue.axis = axis


            try {


                let res = modificationMirroredCurve(initialCurve.allCalculatedPoints, axis)
                newValue.allCalculatedPoints = res
                newValue.geometry =new BufferGeometry().setFromPoints(res);
                newValue.isError = false;
                props.updateObjectByAddingChildrenID(new Array(initialCurve), props.currentObject.id)
                props.updateAllObjectWhenCurrentObjectChange(lastValue, newValue, true)
                props.setCurrentObject(newValue)

            } catch (e) {
                enqueueSnackbar(e.message, {
                    variant: 'error',
                });
                newValue.isError = true;
                props.updateAllObjectWhenCurrentObjectChange(lastValue, newValue, false)
                props.setCurrentObject(newValue)
            }
        }


    }

    const handleFocusOnTextFieldAxis = (e) => {
        setAxis(null)
        props.setCurrentTextFieldSelected({
            id: props.currentObject.id,
            acceptType: ["Axis"],
            clickCtrl: changeAxis,
            simpleClick: changeAxis
        })
    }


    const changeAxis = (axis) => {
        setAxis(axis)
    }


    const handleDisFocusOnTextFieldAxis = (e) => {

        props.setCurrentTextFieldSelected(null)
        setInitialCurve(props.currentObject.initialCurve)
    }


    const keyPressTextFieldInitialCurve = (e) => {
        if (e.keyCode === 13) {
            let lastValue = props.currentObject;
            let newValue = props.currentObject
            newValue.initialCurve = initialCurve


            try {

                let res = modificationMirroredCurve(initialCurve.allCalculatedPoints, axis)
                newValue.allCalculatedPoints = res
                newValue.geometry =new BufferGeometry().setFromPoints(res);
                newValue.isError = false;
                props.updateObjectByAddingChildrenID(new Array(initialCurve), props.currentObject.id)
                props.updateAllObjectWhenCurrentObjectChange(lastValue, newValue, true)
                props.setCurrentObject(newValue)

            } catch (e) {
                enqueueSnackbar(e.message, {
                    variant: 'error',
                });
                newValue.isError = true;
                props.updateAllObjectWhenCurrentObjectChange(lastValue, newValue, false)
                props.setCurrentObject(newValue)
            }


        }
    }

    const handleFocusOnTextFieldInitialCurve = (e) => {
        setInitialCurve(null)
        props.setCurrentTextFieldSelected({
            id: props.currentObject.id,
            acceptType: ["B-Spline", "C-Spline", "Mirrored Curve"],
            clickCtrl: changeInitialCurve,
            simpleClick: changeInitialCurve
        })
    }


    const changeInitialCurve = (point) => {
        setInitialCurve(point)
    }


    const handleDisFocusOnTextFieldInitialCurve = (e) => {

        props.setCurrentTextFieldSelected(null)
        setInitialCurve(props.currentObject.initialCurve)
    }


    return (
        <div>
            <div className={classes.containerRow}>
                <Typography className={classes.text}>
                    Name
                </Typography>
                <TextField value={name} onBlur={blurTextFieldName} onKeyDown={keyPressTextFieldName}
                           onChange={handleChangeTextFieldName}
                           InputProps={{className: classes.inputTextField}}/>
            </div>

            <div className={classes.containerRow}>
                <Typography className={classes.text}>
                    Initial curve
                </Typography>
                <TextField

                    value={
                        initialCurve === null ? "" : initialCurve.name
                    }

                    error={initialCurve === null}
                    helperText={initialCurve === null && "Please enter 1 curve"}
                    onKeyDown={keyPressTextFieldInitialCurve} onBlur={handleDisFocusOnTextFieldInitialCurve}
                    onFocus={handleFocusOnTextFieldInitialCurve} InputProps={{className: classes.inputTextField}}/>

            </div>
            <div className={classes.containerRow}>
                <Typography className={classes.text}>
                    Axis
                </Typography>
                <TextField

                    value={
                        axis === null ? "" : axis.name
                    }

                    error={axis === null}
                    helperText={axis === null && "Please enter 1 axis"}
                    onKeyDown={keyPressTextFieldAxis} onBlur={handleDisFocusOnTextFieldAxis}
                    onFocus={handleFocusOnTextFieldAxis} InputProps={{className: classes.inputTextField}}/>

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