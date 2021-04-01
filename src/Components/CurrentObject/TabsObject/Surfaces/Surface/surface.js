import React from 'react'
import TextField from '@material-ui/core/TextField';
import {Typography} from "@material-ui/core";
import useStyles from "./style";
import Checkbox from "@material-ui/core/Checkbox";
import PropTypes from "prop-types";
import {modificationMirroredPoint, modificationSurface} from "../../../../../Class/Utils";
import {useSnackbar} from "notistack";

Surface.propType = {
    setCurrentObject: PropTypes.func.isRequired,
    currentObject: PropTypes.object.isRequired,
    allObject: PropTypes.array.isRequired,
    updateAllObjectWhenCurrentObjectChange: PropTypes.func.isRequired
}


export default function Surface(props) {
    const classes = useStyles();

    const [name, setName] = React.useState(props.currentObject.name);
    const [isVisible, setIsVisible] = React.useState(props.currentObject.visible);

    const [firstCurve, setFirstCurve] = React.useState(props.currentObject.firstCurve);
    const [secondCurve, setSecondCurve] = React.useState(props.currentObject.secondCurve);

    const {enqueueSnackbar} = useSnackbar();

    React.useEffect((() => {
        setIsVisible(props.currentObject.visible)
        setName(props.currentObject.name)
        setFirstCurve(props.currentObject.firstCurve)
        setSecondCurve(props.currentObject.secondCurve)
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




    const keyPressTextFieldName = (e) => {
        if (e.keyCode === 13) {
            let lastValue = props.currentObject;
            let newValue = props.currentObject
            newValue.name = name
            props.updateAllObjectWhenCurrentObjectChange(lastValue, newValue,false)
            props.setCurrentObject(newValue)


        }
    }



    const keyPressTextFieldSecondCurve = (e) => {
        if (e.keyCode === 13) {
            let lastValue = props.currentObject;
            let newValue = props.currentObject
            newValue.secondCurve = secondCurve


            try {
                let res = modificationSurface(firstCurve, secondCurve)
                newValue.geometry = res;
                newValue.isError = false;
                props.updateObjectByAddingChildrenID(new Array(secondCurve), props.currentObject.id)
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

    const handleFocusOnTextFieldSecondCurve= (e) => {
        setSecondCurve(null)
        props.setCurrentTextFieldSelected({
            id: props.currentObject.id,
            acceptType: ["C-Spline", "B-Spline","Mirrored Curve"],
            clickCtrl: changeSecondCurve,
            simpleClick: changeSecondCurve
        })
    }


    const changeSecondCurve = (curve) => {
        setSecondCurve(curve)
    }


    const handleDisFocusOnTextFieldSecondCurve = (e) => {

        props.setCurrentTextFieldSelected(null)
        setSecondCurve(props.currentObject.firstCurve)
    }
    
    
    

    const keyPressTextFieldFirstCurve = (e) => {
        if (e.keyCode === 13) {
            let lastValue = props.currentObject;
            let newValue = props.currentObject
            newValue.firstCurve = firstCurve


            try {

                let res = modificationSurface(firstCurve, secondCurve)
                newValue.geometry = res;
                newValue.isError = false;
                props.updateObjectByAddingChildrenID(new Array(firstCurve), props.currentObject.id)
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

    const handleFocusOnTextFieldFirstCurve= (e) => {
        setFirstCurve(null)
        props.setCurrentTextFieldSelected({
            id: props.currentObject.id,
            acceptType: ["C-Spline", "B-Spline","Mirrored Curve"],
            clickCtrl: changeFirstCurve,
            simpleClick: changeFirstCurve
        })
    }


    const changeFirstCurve = (curve) => {
        setFirstCurve(curve)
    }


    const handleDisFocusOnTextFieldFirstCurve = (e) => {

        props.setCurrentTextFieldSelected(null)
        setFirstCurve(props.currentObject.firstCurve)
    }



    return (
        <div>
            <div className={classes.containerRow}>
                <Typography className={classes.text}>
                    Name
                </Typography>
                <TextField value={name} onKeyDown={keyPressTextFieldName} onChange={handleChangeTextFieldName}
                           InputProps={{className: classes.inputTextField}}/>
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
                    First Curve
                </Typography>
                <TextField

                    value={
                        firstCurve === null ? "" : firstCurve.name
                    }

                    error={firstCurve === null}
                    helperText={firstCurve === null && "Please enter 1 curve"}
                    onKeyDown={keyPressTextFieldFirstCurve} onBlur={handleDisFocusOnTextFieldFirstCurve}
                    onFocus={handleFocusOnTextFieldFirstCurve} InputProps={{className: classes.inputTextField}}/>
            </div>
            <div className={classes.containerRow}>
                <Typography className={classes.text}>
                    Second Curve
                </Typography> 
                <TextField

                value={
                    secondCurve === null ? "" : secondCurve.name
                }

                error={secondCurve === null}
                helperText={secondCurve === null && "Please enter 1 curve"}
                onKeyDown={keyPressTextFieldSecondCurve} onBlur={handleDisFocusOnTextFieldSecondCurve}
                onFocus={handleFocusOnTextFieldSecondCurve} InputProps={{className: classes.inputTextField}}/>
                

            </div>
        </div>
    )

}