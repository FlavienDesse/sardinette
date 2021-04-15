import React from "react";
import useStyles from "./style";

import icons_cube_front_view from "../../Images/Icons/cube_front_view.png"
import icons_cube_left_view from "../../Images/Icons/cube_left_view.png"
import icons_cube_top_view from "../../Images/Icons/cube_top_view.png"
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import {Box3, Vector3} from "three";
import {useSnackbar} from "notistack";

export default function Toolbar(props) {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();


    const handleClickOnView = (position) => {
        if (props.currentObject) {
            props.currentObject.geometry.computeBoundingBox()
            let box = new Box3()
            box.copy(props.currentObject.geometry.boundingBox).applyMatrix4(props.currentObject.matrixWorld)
            let centerObject = new Vector3()
            let sizeObject = new Vector3()
            box.getCenter(centerObject)
            box.getSize(sizeObject)


            switch (position) {
                case "front":
                    props.camera.position.set(centerObject.x, centerObject.y, centerObject.z)
                    props.camera.position.z = sizeObject.z + 3

                    break;
                case "bottom":
                    props.camera.position.set(centerObject.x, centerObject.y, centerObject.z)
                    props.camera.position.y = sizeObject.y + 3
                    break;
                case "left":
                    props.camera.position.set(centerObject.x, centerObject.y, centerObject.z)
                    props.camera.position.x = sizeObject.x + 3
                    break;
                default:
                    throw new Error("position undefined")


            }
            props.controls.target.set(centerObject.x, centerObject.y, centerObject.z)

            props.camera.updateMatrix()

        } else {
            enqueueSnackbar("No object selected", {
                variant: 'error',
            });
        }

    }

    const handleClickZoom = (zoom) => {
        switch (zoom) {
            case "in":
                props.camera.zoom += 1
                props.camera.updateProjectionMatrix()
                break;
            case "out":
                if (props.camera.zoom !== 1) {
                    props.camera.zoom -= 1
                    props.camera.updateProjectionMatrix()
                }
                break;
            default:
                throw new Error("zoom undefined")
        }
    }


    return (
        <div className={classes.container}>
            <div className={classes.section}>
                <img alt={"front view"} src={icons_cube_front_view} onClick={() => handleClickOnView("front")}/>
                <img alt={"left view"} src={icons_cube_left_view} onClick={() => handleClickOnView("left")}/>
                <img alt={"top view"} src={icons_cube_top_view} onClick={() => handleClickOnView("bottom")}/>
            </div>
            <div className={classes.section}>
                <ZoomInIcon fontSize="large" onClick={() => handleClickZoom("in")}/>
                <ZoomOutIcon fontSize="large" onClick={() => handleClickZoom("out")}/>
            </div>
        </div>
    )

}