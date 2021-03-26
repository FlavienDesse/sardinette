import React from "react";
import PropTypes from "prop-types";
import useStyles from "./style";
import Typography from "@material-ui/core/Typography";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ErrorIcon from '@material-ui/icons/Error';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import {modifyObjectWhenClickOn} from "../../../Class/Utils";

ArrayRenderObject.propTypes = {
    object:PropTypes.object.isRequired,
    setCurrentObject:PropTypes.func.isRequired,
    currentObject:PropTypes.any,

}
/*
     Component for render array of all object
 */
export default function ArrayRenderObject(props){
    const classes = useStyles();

    const handleOnClickTableRow =  ()=>{
        props.setCurrentObject(modifyObjectWhenClickOn(props.object , props.currentObject))
    }

    return(
        <TableRow className={classes.container}  onClick={handleOnClickTableRow}>
            <TableCell>
                {
                    props.object.isError ? <ErrorIcon/> : " "
                }
            </TableCell>
            <TableCell>
                {
                    props.object.visible ? <VisibilityIcon/> : <VisibilityOffIcon/>
                }
            </TableCell>
            <TableCell >
                <Typography>
                    {
                        props.object.type
                    }
                </Typography>
            </TableCell>
            <TableCell >

                    {
                        props.object.name
                    }

            </TableCell>
        </TableRow>
    )
}