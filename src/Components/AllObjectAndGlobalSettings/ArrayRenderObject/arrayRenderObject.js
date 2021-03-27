import React from "react";
import PropTypes from "prop-types";
import AllObjectAndGlobalSettings from "../allObjectAndGlobalSettings";
import useStyles from "../style";
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

ArrayRenderObject.propTypes = {
    object:PropTypes.object.isRequired,
}

export default function ArrayRenderObject(props){
    const classes = useStyles();
    return(
        <Grid container>
            <Grid item xs={3}>
                <Typography>
                    {
                        props.object.name
                    }
                </Typography>
            </Grid>
        </Grid>
    )
}