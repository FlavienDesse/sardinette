import React from "react";
import {Typography} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import useStyles from "./style";
import PropTypes from "prop-types";

BSpline.propType = {
    setCurrentObject: PropTypes.func.isRequired,
    currentObject: PropTypes.object.isRequired,
    allObject: PropTypes.array.isRequired,
    updateAllObjectWhenCurrentObjectChange : PropTypes.func.isRequired
}


export default function BSpline(props){

    const classes = useStyles()


    const [name,setName] = React.useState(props.currentObject.name);
    const [isVisible,setIsVisible]=React.useState(props.currentObject.visible);


    const handleChangeIsVisible = (event)=>{
        setIsVisible(event.target.checked);
        let lastValue = props.currentObject;
        let newValue =  props.currentObject
        newValue.visible = event.target.checked;
        props.updateAllObjectWhenCurrentObjectChange(lastValue,newValue)
        props.setCurrentObject(newValue)
    }

    const handleChangeTextFieldName = (event)=>{
        setName(event.target.value);
    }

    const keyPressTextFieldName = (e) => {
        if(e.keyCode === 13){
            let lastValue = props.currentObject;
            let newValue =  props.currentObject
            newValue.name = name
            props.updateAllObjectWhenCurrentObjectChange(lastValue,newValue)
            props.setCurrentObject(newValue)


        }
    }

    return(
        <div>
            <div className={classes.containerRow}>
                <Typography className={classes.text}>
                    Name
                </Typography>
                <TextField   value={name} onKeyDown={keyPressTextFieldName} onChange={handleChangeTextFieldName}  InputProps={{className: classes.inputTextField}} />
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