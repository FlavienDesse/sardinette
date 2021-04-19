import React from 'react'
import TextField from '@material-ui/core/TextField';
import {Typography} from "@material-ui/core";
import useStyles from "./style";
import Checkbox from "@material-ui/core/Checkbox";
import PropTypes from "prop-types";
import {useSnackbar} from "notistack";
import {updateObjectByAddingChildrenID} from "../../../../../Misc/Utils";
import Constant from "../../../../../Misc/Constant";

Surface.propType = {
    setCurrentObject: PropTypes.func.isRequired,
    currentObject: PropTypes.object.isRequired,
    allObject: PropTypes.array.isRequired,
    updateAllObjectWhenCurrentObjectChange: PropTypes.func.isRequired
}


export default function Surface(props) {
    const classes = useStyles();

    const [name, setName] = React.useState(props.currentObject.userData.name);
    const [isVisible, setIsVisible] = React.useState(props.currentObject.visible);

    const [firstCurve, setFirstCurve] = React.useState(props.currentObject.userData.firstCurve);
    const [secondCurve, setSecondCurve] = React.useState(props.currentObject.userData.secondCurve);

    const {enqueueSnackbar} = useSnackbar();


    React.useEffect((() => {
        setIsVisible(props.currentObject.visible)
        setName(props.currentObject.userData.name)
        setFirstCurve(props.currentObject.userData.firstCurve)
        setSecondCurve(props.currentObject.userData.secondCurve)
    }), [props.currentObject])


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
            let lastValue = props.currentObject;
            let newValue = props.currentObject
            newValue.userData.name = name
            props.updateAllObjectWhenCurrentObjectChange(lastValue, newValue, false)
            props.setCurrentObject(newValue)


        }
    }


    const keyPressTextFieldSecondCurve = (e) => {
        if (e.keyCode === 13) {
            let lastValue = props.currentObject;
            let newValue = props.currentObject
            newValue.userData.secondCurve = secondCurve


            try {
                updateObjectByAddingChildrenID(new Array(secondCurve), props.currentObject.id, props.allObject, props.setAllObject)
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

    const handleFocusOnTextFieldSecondCurve = (e) => {
        setSecondCurve(null)
        props.setCurrentTextFieldSelected({
            id: props.currentObject.id,
            acceptType: Constant.CONSTANT_ALL_CURVES,
            clickCtrl: changeSecondCurve,
            simpleClick: changeSecondCurve
        })
    }


    const changeSecondCurve = (curve) => {
        setSecondCurve(curve)
    }


    const handleDisFocusOnTextFieldSecondCurve = (e) => {

        props.setCurrentTextFieldSelected(null)
        setSecondCurve(props.currentObject.userData.secondCurve)
    }


    const keyPressTextFieldFirstCurve = (e) => {
        if (e.keyCode === 13) {
            let lastValue = props.currentObject;
            let newValue = props.currentObject
            newValue.userData.firstCurve = firstCurve


            try {
                updateObjectByAddingChildrenID(new Array(firstCurve), props.currentObject.id, props.allObject, props.setAllObject)
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

    const handleFocusOnTextFieldFirstCurve = (e) => {
        setFirstCurve(null)
        props.setCurrentTextFieldSelected({
            id: props.currentObject.id,
            acceptType: Constant.CONSTANT_ALL_CURVES,
            clickCtrl: changeFirstCurve,
            simpleClick: changeFirstCurve
        })
    }


    const changeFirstCurve = (curve) => {
        setFirstCurve(curve)
    }


    const handleDisFocusOnTextFieldFirstCurve = (e) => {

        props.setCurrentTextFieldSelected(null)
        setFirstCurve(props.currentObject.userData.firstCurve)
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
                        firstCurve === null ? "" : firstCurve.userData.name
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
                        secondCurve === null ? "" : secondCurve.userData.name
                    }

                    error={secondCurve === null}
                    helperText={secondCurve === null && "Please enter 1 curve"}
                    onKeyDown={keyPressTextFieldSecondCurve} onBlur={handleDisFocusOnTextFieldSecondCurve}
                    onFocus={handleFocusOnTextFieldSecondCurve} InputProps={{className: classes.inputTextField}}/>


            </div>
        </div>
    )

}