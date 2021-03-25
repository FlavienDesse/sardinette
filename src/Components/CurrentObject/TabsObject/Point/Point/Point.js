import React from 'react'
import TextField from '@material-ui/core/TextField';
import {Typography} from "@material-ui/core";
import useStyles from "./style";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import PropTypes from "prop-types";

Point.propType = {
    setCurrentObject: PropTypes.func.isRequired,
    currentObject: PropTypes.object.isRequired,
    allObject: PropTypes.array.isRequired,
    updateAllObjectWhenCurrentObjectChange : PropTypes.func.isRequired
}


export default function Point(props) {
    const classes = useStyles();


    const [isVisible,setIsVisible]=React.useState(props.currentObject.visible);


    const [name,setName] = React.useState(props.currentObject.name);

    const [position,setPosition] = React.useState({...props.currentObject.position});





    React.useEffect((() => {
        setName(props.currentObject.name)
        setPosition({...props.currentObject.position})
    }),[props.currentObject])




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

    const handleChangeTextFieldPositionX= (event)=>{

        setPosition(prevState => {
            return {...prevState, x: event.target.value}
        })

    }

    const handleChangeTextFieldPositionY = (event)=>{
        setPosition(prevState => {
            return {...prevState, y: event.target.value}
        })
    }

    const handleChangeTextFieldPositionZ = (event)=>{
        setPosition(prevState => {
            return {...prevState, z:event.target.value}
        })
    }


    const keyPressTextFieldPosition = (e) => {
        if(e.keyCode === 13){
            let lastValue = props.currentObject;
            let newValue =  props.currentObject
            newValue.position.x = position.x
            newValue.position.y = position.y
            newValue.position.z = position.z
            props.updateAllObjectWhenCurrentObjectChange(lastValue,newValue)
            props.setCurrentObject(newValue)


        }
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


    return (
        <Grid>
            <div className={classes.containerRow}>
                <Typography className={classes.text}>
                    Name
                </Typography>
                <TextField   value={name} onKeyDown={keyPressTextFieldName} onChange={handleChangeTextFieldName}  InputProps={{className: classes.inputTextField}} />
            </div>
            <div className={classes.containerRow}>
                <Typography className={classes.text}>
                    Position
                </Typography>
                <TextField value={position.x} onKeyDown={keyPressTextFieldPosition} onChange={handleChangeTextFieldPositionX} InputProps={{className: classes.inputTextFieldPosition}} />
                <TextField value={position.y} onKeyDown={keyPressTextFieldPosition} onChange={handleChangeTextFieldPositionY} InputProps={{className: classes.inputTextFieldPosition}} />
                <TextField value={position.z} onKeyDown={keyPressTextFieldPosition} onChange={handleChangeTextFieldPositionZ} InputProps={{className: classes.inputTextFieldPosition}} />
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
        </Grid>
    )

}