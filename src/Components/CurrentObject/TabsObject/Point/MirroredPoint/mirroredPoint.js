import React from 'react'
import TextField from '@material-ui/core/TextField';
import {Typography} from "@material-ui/core";
import useStyles from "./style";
import Checkbox from "@material-ui/core/Checkbox";
import PropTypes from "prop-types";
import {useSnackbar} from "notistack";
import {modificationMirroredPoint} from "../../../../../Class/Utils";

MirroredPoint.propType = {
    setCurrentObject: PropTypes.func.isRequired,
    currentObject: PropTypes.object.isRequired,
    allObject: PropTypes.array.isRequired,
    updateAllObjectWhenCurrentObjectChange: PropTypes.func.isRequired
}


export default function MirroredPoint(props) {
    const classes = useStyles();

    const {enqueueSnackbar} = useSnackbar();


    const [weight, setWeight] = React.useState(props.currentObject.weight);

    const [name, setName] = React.useState(props.currentObject.name);
    const [isVisible, setIsVisible] = React.useState(props.currentObject.visible);

    const [initialPoint, setInitialPoint] = React.useState(props.currentObject.initialPoint);

    const [axis, setAxis] = React.useState(props.currentObject.axis);


    React.useEffect((() => {
        setWeight(props.currentObject.weight)
        setIsVisible(props.currentObject.visible)
        setName(props.currentObject.name)
        setInitialPoint(props.currentObject.initialPoint)
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


    const handleChangeTextFieldWeight = (e) => {
        setWeight(e.target.value)
    }


    const keyPressTextFieldWeight = (e) => {
        if (e.keyCode === 13) {
            let lastValue = props.currentObject;
            let newValue = props.currentObject
            newValue.weight = weight
            props.updateAllObjectWhenCurrentObjectChange(lastValue, newValue, true)
            props.setCurrentObject(newValue)
        }
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
                let res = modificationMirroredPoint(initialPoint, axis)
                newValue.position.set(res.x,res.y,res.z)
                newValue.isError = false;
                props.updateObjectByAddingChildrenID(new Array(initialPoint), props.currentObject.id)
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
        setInitialPoint(props.currentObject.initialPoint)
    }


    const keyPressTextFieldInitialPoint = (e) => {
        if (e.keyCode === 13) {
            let lastValue = props.currentObject;
            let newValue = props.currentObject
            newValue.initialPoint = initialPoint


            try {
                let res = modificationMirroredPoint(initialPoint, axis)
                newValue.position.set(res.x,res.y,res.z)
                newValue.isError = false;
                props.updateObjectByAddingChildrenID(new Array(initialPoint), props.currentObject.id)
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

    const handleFocusOnTextFieldInitialPoint= (e) => {
        setInitialPoint(null)
        props.setCurrentTextFieldSelected({
            id: props.currentObject.id,
            acceptType: ["Point", "Mirrored Point"],
            clickCtrl: changeInitialPoint,
            simpleClick: changeInitialPoint
        })
    }


    const changeInitialPoint = (point) => {
        setInitialPoint(point)
    }


    const handleDisFocusOnTextFieldInitialPoint= (e) => {

        props.setCurrentTextFieldSelected(null)
        setInitialPoint(props.currentObject.initialPoint)
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
                    Initial point
                </Typography>
                <TextField

                    value={
                        initialPoint === null ? "" : initialPoint.name
                    }

                    error={initialPoint === null}
                    helperText={initialPoint === null && "Please enter 1 point"}
                    onKeyDown={keyPressTextFieldInitialPoint} onBlur={handleDisFocusOnTextFieldInitialPoint}
                    onFocus={handleFocusOnTextFieldInitialPoint} InputProps={{className: classes.inputTextField}}/>

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
            <div className={classes.containerRow}>
                <Typography className={classes.text}>
                    Weight
                </Typography>
                <TextField value={weight} onKeyDown={keyPressTextFieldWeight} onChange={handleChangeTextFieldWeight}
                           InputProps={{className: classes.inputSmallTextField}}/>

            </div>
        </div>
    )

}