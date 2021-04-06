import React from "react";
import PropTypes from "prop-types";
import useStyles from "./style";
import Typography from "@material-ui/core/Typography";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ErrorIcon from '@material-ui/icons/Error';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import {modifyObjectWhenClickOn} from "../../../Misc/Utils";
import clsx from "clsx";

ArrayRenderObject.propTypes = {
  currentObject: PropTypes.any,
  currentTextFieldSelected: PropTypes.object,
  object: PropTypes.object.isRequired,
  setCurrentObject: PropTypes.func.isRequired
}
/*
     Component for render array of all object
 */
export default function ArrayRenderObject(props){
    const classes = useStyles();


    let handleOnClickTableRow = (event)=>{
        event.preventDefault();
        event.stopPropagation();

        if (props.currentTextFieldSelected !== null && props.currentTextFieldSelected.id !==props.object.id && props.currentTextFieldSelected.acceptType.includes(props.object.type)) {
            if (event.ctrlKey) {
                event.preventDefault();
                props.currentTextFieldSelected.clickCtrl(props.object)
            } else {
                event.preventDefault();
                props.currentTextFieldSelected.simpleClick(props.object)
            }
        } else {

           props.setCurrentObject(modifyObjectWhenClickOn(props.object, props.currentObject))
        }

    }


    return(
        <TableRow className={clsx(classes.container , props.currentObject!= null && props.currentObject.id === props.object.id && classes.selected)}  onMouseDown={handleOnClickTableRow}>

            <TableCell>
                {
                    props.object.isError ? <ErrorIcon className={classes.redIcon}/> : " "
                }
            </TableCell>
            <TableCell>
                {
                    props.object.visible ? <VisibilityIcon/> : <VisibilityOffIcon/>
                }
            </TableCell>
            <TableCell >
                <Typography className={ clsx(props.currentObject!= null && props.currentObject.id === props.object.id && classes.selectedText)}>
                    {
                        props.object.type
                    }
                </Typography>
            </TableCell>
            <TableCell className={ clsx(props.currentObject!= null && props.currentObject.id === props.object.id && classes.selectedText)}>

                    {
                        props.object.name
                    }

            </TableCell>
        </TableRow>
    )
}