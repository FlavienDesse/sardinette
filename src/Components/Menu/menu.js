import React from "react";
import useStyles from "./style";
import OpenFile from "./OpenFile/openFile";
import OpenInsert from "./OpenInsert/openInsert";
import OpenExamples from "./OpenExamples/openExamples";
import PropTypes from "prop-types";
import MenuRC from "rc-menu";
import 'rc-menu/assets/index.css';

Menu.propType = {

    setAllObject: PropTypes.func.isRequired,
}

export default function Menu(props) {
    const classes = useStyles();


    return (
        <MenuRC
            className={classes.menu}
            defaultActiveFirst
            mode={"horizontal"}
            selectable={false}
            inlineIndent={100}
        >
           <OpenFile/>
           <OpenInsert setAllObject={props.setAllObject}/>
           <OpenExamples/>


        </MenuRC>
    )


}

/*
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
 */