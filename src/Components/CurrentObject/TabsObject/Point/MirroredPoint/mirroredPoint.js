import React from 'react'
import TextField from '@material-ui/core/TextField';
import {Typography} from "@material-ui/core";
import useStyles from "./style";
import Checkbox from "@material-ui/core/Checkbox";
import PropTypes from "prop-types";
import {useSnackbar} from "notistack";

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

    const [point, setPoint] = React.useState();


    React.useEffect((() => {
        setWeight(props.currentObject.weight)
        setIsVisible(props.currentObject.visible)
        setName(props.currentObject.name)
        setPoint(props.currentObject.initialPoint)
    }), [props.currentObject])


    const blurTextFieldName = (event) => {
        setName(props.currentObject.name);
    }

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



    const handleChangeTextFieldWeight = (e) => {
        setWeight(e.target.value)
    }




    const keyPressTextFieldWeight = (e) => {
        if (e.keyCode === 13) {
            let lastValue = props.currentObject;
            let newValue = props.currentObject
            newValue.weight = weight
            props.updateAllObjectWhenCurrentObjectChange(lastValue, newValue,true)
            props.setCurrentObject(newValue)
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


    return (
        <div>
            <div className={classes.containerRow}>
                <Typography className={classes.text}>
                    Name
                </Typography>
                <TextField value={name} onBlur={blurTextFieldName}onKeyDown={keyPressTextFieldName} onChange={handleChangeTextFieldName}
                           InputProps={{className: classes.inputTextField}}/>
            </div>
            <div className={classes.containerRow}>
                <Typography className={classes.text}>
                    Initial point
                </Typography>

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