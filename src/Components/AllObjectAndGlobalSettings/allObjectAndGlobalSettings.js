import React from "react";
import useStyles from "./style";
import {Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {ChromePicker} from 'react-color'
import PropTypes from 'prop-types';
import Background from "../../Class/Background";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ArrayRenderObject from "./ArrayRenderObject/arrayRenderObject";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from "@material-ui/core/Paper";

AllObjectAndGlobalSettings.propTypes = {
    setBackground: PropTypes.func.isRequired,
    allObject: PropTypes.array.isRequired,
    setCurrentObject:PropTypes.func.isRequired,
    currentObject:PropTypes.any,
    currentTextFieldSelected:PropTypes.object.isRequired,

}

/*
    Component of all objects and global settings
    This is the thing in the right of the page
 */

export default function AllObjectAndGlobalSettings(props) {
    const classes = useStyles();

    const [backgroundType, setBackgroundType] = React.useState("Empty");
    const [backgroundColor, setBackgroundColor] = React.useState("#FFFFFF");
    const [displayColorPicker, setDisplayColorPicker] = React.useState(false);

    const handleChangeBackgroundType = (event) => {
        setBackgroundType(event.target.value);
        if (event.target.value === "Color") {
            props.setBackground(Background.FromColor(backgroundColor))
        } else if (event.target.value === "Empty") {
            props.setBackground(Background.FromEmpty())
        }
    };

    const handleCloseColorPicker = () => {
        setDisplayColorPicker(false);
    }

    const handleChangeColor = (color) => {
        setBackgroundColor(color.hex)
        props.setBackground(Background.FromColor(color.hex))
    }

    const handleClickOpenColorPicker = (event) => {

        setDisplayColorPicker(!displayColorPicker);
    }





    return (
        <div className={classes.container}>

            <Button className={classes.containerTitle}>
                <Typography className={classes.title} variant="h1" component="h2">
                    ALL OBJECTS
                </Typography>
            </Button>

            <TableContainer component={Paper} className={classes.containerAllObject}>
                <Table className={classes.table} >
                    <TableHead>
                        <TableRow>
                            <TableCell>Error</TableCell>
                            <TableCell >Visibility</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell >Name</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            props.allObject.map((object, index) =>
                               <ArrayRenderObject key={object.id} currentTextFieldSelected={props.currentTextFieldSelected} currentObject={props.currentObject} setCurrentObject={props.setCurrentObject} object={object}/>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container alignItems={"center"} justify={"center"}>
                <Grid item xs={4}>
                    <Typography>
                        BackGround
                    </Typography>

                </Grid>
                <Grid item xs={8}>
                    <Select
                        value={backgroundType}
                        className={classes.select}
                        onChange={handleChangeBackgroundType}
                        MenuProps={{
                            anchorOrigin: {
                                vertical: "bottom",
                                horizontal: "left"
                            },
                            getContentAnchorEl: null
                        }}
                    >
                        <MenuItem value={"Color"}>Color</MenuItem>
                        <MenuItem value={"Empty"}>Empty</MenuItem>
                    </Select>

                    {
                        backgroundType === "Color" &&
                        <div className={classes.containerColorPicker}>
                            <div onClick={handleClickOpenColorPicker}>
                                <div style={{
                                    width: '36px',
                                    height: '14px',
                                    borderRadius: '2px',
                                    background: backgroundColor,
                                    border: "solid black 2px"
                                }}/>
                            </div>
                            {displayColorPicker &&
                            <ClickAwayListener onClickAway={handleCloseColorPicker}>
                                <div className={classes.popoverColorPicker}>
                                    <ChromePicker disableAlpha={true} color={backgroundColor}
                                                  onChange={handleChangeColor}/>
                                </div>

                            </ClickAwayListener>
                            }
                        </div>


                    }


                </Grid>

            </Grid>

        </div>
    );
}

