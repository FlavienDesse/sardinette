import React from "react";
import {Button} from "@material-ui/core";
import useStyles from "./style";


export default function Menu(){
    const classes = useStyles();

    return (
        <div>
            <Button >
                File
            </Button>
            <Button >
                Insert
            </Button>
            <Button  >
                View
            </Button>
        </div>
    )

}