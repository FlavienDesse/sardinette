import React from 'react'
import TextField from '@material-ui/core/TextField';
import {Typography} from "@material-ui/core";
import useStyles from "./style";
import Checkbox from "@material-ui/core/Checkbox";
import PropTypes from "prop-types";
import {useSnackbar} from "notistack";
import {updateObjectByAddingChildrenID} from "../../../../../Misc/Utils";
import Constant from "../../../../../Misc/Constant";

CLoftSurface.propType = {
    setCurrentObject: PropTypes.func.isRequired,
    currentObject: PropTypes.object.isRequired,
    allObject: PropTypes.array.isRequired,
    updateAllObjectWhenCurrentObjectChange: PropTypes.func.isRequired
}


export default function CLoftSurface(props) {
    const classes = useStyles();

    const [name, setName] = React.useState(props.currentObject.userData.name);
    const [isVisible, setIsVisible] = React.useState(props.currentObject.visible);

    const [allCurves, setAllCurves] = React.useState(props.currentObject.userData.allCurves);

    const {enqueueSnackbar} = useSnackbar();

    React.useEffect((() => {
        setIsVisible(props.currentObject.visible)
        setName(props.currentObject.userData.name)
        setAllCurves(props.currentObject.userData.allCurves)
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


    const keyPressTextFieldCurves = (e) => {
        if (e.keyCode === 13) {
            let lastValue = props.currentObject;
            let newValue = props.currentObject
            newValue.userData.allCurves = allCurves

            try {
                updateObjectByAddingChildrenID(allCurves, props.currentObject.id, props.allObject, props.setAllObject)
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

    const handleFocusOnTextFieldCurves = (e) => {
        setAllCurves([])
        props.setCurrentTextFieldSelected({
            id: props.currentObject.id,
            acceptType: ["C-Spline"],
            clickCtrl: addCurves,
            simpleClick: setOneCurve
        })
    }

    const handleDisFocusOnTextFieldControlsPoints = (e) => {

        props.setCurrentTextFieldSelected(null)
        setAllCurves(props.currentObject.userData.allCurves)
    }

    const addCurves = (curve) => {
        setAllCurves((prevState) => {
            prevState.push(curve)

            return [...prevState]
        })

    }

    const setOneCurve= (curve) => {
        setAllCurves((prevState) => {
            prevState = []
            prevState.push(curve)
            return [...prevState]
        })
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
                    All Curves
                </Typography>
                <TextField

                    value={
                        allCurves.map(a => a.userData.name)
                    }

                    error={allCurves.length < 1}
                    helperText={allCurves.length < 1 && "Please enter at least 2 curves"}
                    onKeyDown={keyPressTextFieldCurves} onBlur={handleDisFocusOnTextFieldControlsPoints}
                    onFocus={handleFocusOnTextFieldCurves} InputProps={{className: classes.inputTextField}}/>
            </div>

        </div>
    )

}