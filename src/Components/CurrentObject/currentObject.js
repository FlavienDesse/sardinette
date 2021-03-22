import React from "react";
import useStyles from "./style";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Menu from "@material-ui/core/Menu";
import PropTypes from "prop-types";
import TabsObject from "./TabsObject/tabsObject";


Menu.propType = {
    setCurrentObject:PropTypes.func.isRequired,
    currentObject:PropTypes.object.isRequired,
}


export default function CurrentObject(props) {
    const classes = useStyles();

    const [currentTabs, setCurrentTabs] = React.useState(0);

    const handleChangeTabs = (event, newValue) => {
        setCurrentTabs(newValue);
    };

    return (
        <div  className={classes.container}>
            <Tabs
                variant="fullWidth"
                value={currentTabs}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChangeTabs}
                className={classes.tabs}
            >
                <Tab label="OBJECT" />
                <Tab label="GEOMETRY" />
                <Tab label="TEXTURE" />
            </Tabs>
            {
                currentTabs === 0  && <TabsObject/>
            }
        </div>
    );
}

