import React from 'react'
import TextField from '@material-ui/core/TextField';
import {Typography} from "@material-ui/core";
import useStyles from "./style";
import Checkbox from "@material-ui/core/Checkbox";
import PropTypes from "prop-types";
import {useSnackbar} from "notistack";
import {updateObjectByAddingChildrenID} from "../../../../../Misc/Utils";
import Constant from "../../../../../Misc/Constant";

MirroredPoint.propType = {
    setCurrentObject: PropTypes.func.isRequired,
    currentObject: PropTypes.object.isRequired,
    allObject: PropTypes.array.isRequired,
    updateAllObjectWhenCurrentObjectChange: PropTypes.func.isRequired
}


export default function MirroredPoint(props) {
    const classes = useStyles();

    const {enqueueSnackbar} = useSnackbar();


    const [weight, setWeight] = React.useState(props.currentObject.userData.weight);

    const [name, setName] = React.useState(props.currentObject.userData.name);
    const [isVisible, setIsVisible] = React.useState(props.currentObject.visible);

    const [initialPoint, setInitialPoint] = React.useState(props.currentObject.userData.initialPoint);

    const [axis, setAxis] = React.useState(props.currentObject.userData.axis);


    React.useEffect((() => {
        setWeight(props.currentObject.userData.weight)
        setIsVisible(props.currentObject.visible)
        setName(props.currentObject.userData.name)
        setInitialPoint(props.currentObject.userData.initialPoint)
        setAxis(props.currentObject.userData.axis)
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
            newValue.userData.weight = weight
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
                newValue.userData.name = name
                props.updateAllObjectWhenCurrentObjectChange(lastValue, newValue, false)
                props.setCurrentObject(newValue)
            }

        }
    }


    const keyPressTextFieldAxis = (e) => {
        if (e.keyCode === 13) {
            let lastValue = props.currentObject;
            let newValue = props.currentObject
            newValue.userData.axis = axis


            try {
                updateObjectByAddingChildrenID(new Array(initialPoint), props.currentObject.id, props.allObject, props.setAllObject)
                newValue.userData.update()


            } catch (e) {
                enqueueSnackbar(e.message, {
                    variant: 'error',
                });
            }
            props.updateAllObjectWhenCurrentObjectChange(lastValue, newValue, true)
            props.setCurrentObject(newValue)
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
        setInitialPoint(props.currentObject.userData.initialPoint)
    }


    const keyPressTextFieldInitialPoint = (e) => {
        if (e.keyCode === 13) {
            let lastValue = props.currentObject;
            let newValue = props.currentObject
            newValue.userData.initialPoint = initialPoint


            try {
                updateObjectByAddingChildrenID(new Array(initialPoint), props.currentObject.id, props.allObject, props.setAllObject)
                newValue.userData.update()


            } catch (e) {
                enqueueSnackbar(e.message, {
                    variant: 'error',
                });

            }

            props.updateAllObjectWhenCurrentObjectChange(lastValue, newValue, true)
            props.setCurrentObject(newValue)
        }
    }

    const handleFocusOnTextFieldInitialPoint = (e) => {
        setInitialPoint(null)
        props.setCurrentTextFieldSelected({
            id: props.currentObject.id,
            acceptType: Constant.CONSTANT_ALL_POINTS,
            clickCtrl: changeInitialPoint,
            simpleClick: changeInitialPoint
        })
    }


    const changeInitialPoint = (point) => {
        setInitialPoint(point)
    }


    const handleDisFocusOnTextFieldInitialPoint = (e) => {

        props.setCurrentTextFieldSelected(null)
        setInitialPoint(props.currentObject.userData.initialPoint)
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
                        initialPoint === null ? "" : initialPoint.userData.name
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
                        axis === null ? "" : axis.userData.name
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