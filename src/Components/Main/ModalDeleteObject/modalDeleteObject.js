import React from "react";
import useStyles from "./style";
import {Button, Typography} from "@material-ui/core";


export default function ModalDeleteObject(props){

    const classes = useStyles();
    const [name, setName] = React.useState("");

    React.useEffect(()=>{
        if(props.currentObject){
            setName(props.currentObject.name)

        }
    },[props.currentObject])

    return (
        <div  className={classes.paper}>
            <Typography variant={"body1"}>
                Are you sure you want to delete {name} ?
            </Typography>
            <Typography variant={"body1"}>
                {props.number } object(s) will be impacted
            </Typography>
            <div className={classes.containerButton}>
                <Button className={classes.button} variant={"contained"} color={"secondary"} onClick={props.close}>
                    Close
                </Button>
                <Button variant={"contained"} color={"primary"} onClick={props.delete}>
                    Accept
                </Button>
            </div>

        </div>
    )
}