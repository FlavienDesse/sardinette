import React from "react";
import useStyles from "./style";
import {Paper} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";


export default function CurrentObject() {
    const classes = useStyles();

    const [value, setValue] = React.useState(2);

    const handleChangeTabs = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div  className={classes.container}>
            <Tabs
                variant="fullWidth"
                value={value}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChangeTabs}
            >
                <Tab label="OBJECT" />
                <Tab label="GEOMETRY" />
                <Tab label="TEXTURE" />
            </Tabs>
        </div>
    );
}

