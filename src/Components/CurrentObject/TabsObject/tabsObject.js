import React from 'react'
import TextField from '@material-ui/core/TextField';
import {Typography} from "@material-ui/core";
import useStyles from "./style";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";

export default function TabsObject() {
    const classes = useStyles();


    const [isVisible,setIsVisible]=React.useState();

    const handleChangeIsVisible = (event)=>{
        setIsVisible(event.target.checked);
    }

    return (
        <Grid>
            <div className={classes.containerRow}>
                <Typography className={classes.text}>
                    Name
                </Typography>
                <TextField  InputProps={{className: classes.inputTextField}} />
            </div>
            <div className={classes.containerRow}>
                <Typography className={classes.text}>
                    Position
                </Typography>
                <TextField InputProps={{className: classes.inputTextFieldPosition}} />
                <TextField InputProps={{className: classes.inputTextFieldPosition}} />
                <TextField InputProps={{className: classes.inputTextFieldPosition}} />
            </div>
            <div className={classes.containerRow}>
                <Typography className={classes.text}>
                    Visible
                </Typography>
                <Checkbox
                    checked={isVisible}
                    color="primary"
                    onChange={handleChangeIsVisible}
                />
            </div>
        </Grid>
    )

}