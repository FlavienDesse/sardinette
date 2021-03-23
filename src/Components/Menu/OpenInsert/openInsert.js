import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from '@material-ui/core/Menu';
import PropTypes from 'prop-types';
import useStyles from "./style";
import {createPoint} from "../../../Class/Utils"




Menu.propType = {

    setAllObject:PropTypes.func.isRequired,
}



export default function OpenInsert(props) {

    const classes = useStyles();


    const handleAddPoint = ()=>{
        props.setAllObject((prevState)=>{

            let point = createPoint()

            prevState.push(point)

            return [...prevState]
        })
    }

    return (
        <div className={classes.container}>
            <MenuItem onClick={handleAddPoint}>Point</MenuItem>


        </div>
    )


}

