import React from 'react'
import TextField from '@material-ui/core/TextField';
import {Typography} from "@material-ui/core";
import useStyles from "./style";
import Grid from "@material-ui/core/Grid";
import {rgbToHex} from "../../../Class/Utils";
import {ChromePicker} from "react-color";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

import PropTypes from "prop-types";



TabsTexture.propType = {
    setCurrentObject: PropTypes.func.isRequired,
    currentObject: PropTypes.object.isRequired,
    setAllObject:PropTypes.array.isRequired,
}


export default function TabsTexture(props) {
    const classes = useStyles();



    const [color, setColor] = React.useState("#"+props.currentObject.material.color.getHexString());

    const [displayColorPicker, setDisplayColorPicker] = React.useState(false);

    const handleCloseColorPicker = () => {
        setDisplayColorPicker(false);
    }

    const handleChangeColor = (color) => {
        let newColor = parseInt(color.hex.replace("#", '0x'), 16)
        props.currentObject.material.color.setHex(newColor)
        setColor(color.hex)
    }
    const handleClickOpenColorPicker = (event) => {

        setDisplayColorPicker(!displayColorPicker);
    }

    return (
        <Grid>
            <div className={classes.containerRow}>
                <Typography className={classes.text}>
                    Color
                </Typography>
                <div className={classes.containerColorPicker}>
                    <div onClick={handleClickOpenColorPicker}>
                        <div style={{
                            width: '36px',
                            height: '14px',
                            borderRadius: '2px',
                            background: color,
                            border:"solid black 2px"
                        }}/>
                    </div>
                {displayColorPicker &&
                <ClickAwayListener onClickAway={handleCloseColorPicker}>
                    <div className={classes.popoverColorPicker}>
                        <ChromePicker disableAlpha={true} color={color} onChange={handleChangeColor}/>
                    </div>

                </ClickAwayListener>
                }
                </div>

            </div>

        </Grid>
    )

}