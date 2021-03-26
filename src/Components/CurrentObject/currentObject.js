import React from "react";
import useStyles from "./style";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import TabsObject from "./TabsObject/tabsObject";
import TabsTexture from "./TabsTexture/tabsTexture";


CurrentObject.propType = {
    setCurrentObject:PropTypes.func.isRequired,
    currentObject:PropTypes.object.isRequired,
    updateAllObjectWhenCurrentObjectChange : PropTypes.func.isRequired,
    allObject:PropTypes.array.isRequired,
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
                <Tab label="TEXTURE" />
            </Tabs>
            {
                currentTabs === 0  && <TabsObject allObject={props.allObject} updateAllObjectWhenCurrentObjectChange={props.updateAllObjectWhenCurrentObjectChange} setAllObject={props.setAllObject} currentObject={props.currentObject} setCurrentObject={props.setCurrentObject}/>
            }
            {
                currentTabs === 1  && <TabsTexture setAllObject={props.setAllObject} currentObject={props.currentObject} setCurrentObject={props.setCurrentObject}/>
            }
        </div>
    );
}

