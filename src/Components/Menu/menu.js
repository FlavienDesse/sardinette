import React from "react";
import {Button} from "@material-ui/core";
import useStyles from "./style";
import OpenFile from "./OpenFile/openFile";
import OpenInsert from "./OpenInsert/openInsert";
import OpenView from "./OpenView/openView";
import OpenExamples from "./OpenExamples/openExamples";
import PropTypes from "prop-types";


Menu.propType = {

    setAllObject:PropTypes.func.isRequired,
}

export default function Menu(props) {
    const classes = useStyles();

    const [openMenu, setOpenMenu] = React.useState([false, false, false,false]);
    const handleCloseMenu = (event,pos) => {
        setOpenMenu((prevState => {
            prevState[pos] = false;
            return [...prevState];
        }))
    };


    const handleOpenMenu = (event,pos) => {
        setOpenMenu((prevState => {
            prevState[pos] = true;
            return [...prevState];
        }))
    };


    return (
        <div>
            <div className={classes.containerButton} onMouseEnter={(event => handleOpenMenu(event,0))} onMouseLeave={(event => handleCloseMenu(event,0))}>
                <Button className={classes.button} aria-haspopup={true}>
                    File
                </Button>
                {openMenu[0] && <OpenFile />}
            </div>
            <div className={classes.containerButton} onMouseEnter={(event => handleOpenMenu(event,1))} onMouseLeave={(event => handleCloseMenu(event,1))}>
                <Button className={classes.button} aria-haspopup={true}>
                    Insert
                </Button>
                {openMenu[1] && <OpenInsert setAllObject={props.setAllObject}/>}
            </div>
            <div className={classes.containerButton} onMouseEnter={(event => handleOpenMenu(event,2))}  onMouseLeave={(event => handleCloseMenu(event,2))}>
                <Button className={classes.button} aria-haspopup={true}>
                    View
                </Button>
                {openMenu[2] && <OpenView/>}
            </div>
            <div className={classes.containerButton} onMouseEnter={(event => handleOpenMenu(event,3))}  onMouseLeave={(event => handleCloseMenu(event,3))}>
                <Button className={classes.button} aria-haspopup={true}>
                    Examples
                </Button>
                {openMenu[3] && <OpenExamples/>}
            </div>

        </div>
    )

}