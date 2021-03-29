import React from 'react'
import TextField from '@material-ui/core/TextField';
import {Typography} from "@material-ui/core";
import useStyles from "./style";
import Checkbox from "@material-ui/core/Checkbox";
import PropTypes from "prop-types";

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

            </div>
            <div className={classes.containerRow}>
                <Typography className={classes.text}>
                    Second Curve
                </Typography>

            </div>
        </div>
    )

}