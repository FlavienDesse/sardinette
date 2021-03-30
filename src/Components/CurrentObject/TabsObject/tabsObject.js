import React from "react";
import PropTypes from "prop-types";
import Point from "./Point/Point/point"
import BSpline from "./Curve/B-Spline/bSpline";
import Surface from "./Surfaces/Surface/surface";
import CSpline from "./Curve/C-Spline/cSpline";
import MirroredPoint from "./Point/MirroredPoint/mirroredPoint";

TabsObject.propType = {
    setCurrentObject: PropTypes.func.isRequired,
    currentObject: PropTypes.object.isRequired,
    allObject: PropTypes.array.isRequired,
    updateAllObjectWhenCurrentObjectChange: PropTypes.func.isRequired,
    setCurrentTextFieldSelected:PropTypes.func.isRequired,
    updateObjectByAddingChildrenID:PropTypes.func.isRequired,
}

export default function TabsObject(props) {


    const [typeObject, setTypeObject] = React.useState(props.currentObject.type)


    React.useEffect(()=>{
        setTypeObject(props.currentObject.type)
    },[props.currentObject])

    return (
        <div>

            {

                typeObject === "Point" ? <Point   setCurrentObject={props.setCurrentObject} currentObject={props.currentObject} allObject={props.allObject} updateAllObjectWhenCurrentObjectChange={props.updateAllObjectWhenCurrentObjectChange}/> :
                    typeObject === "B-Spline" ? <BSpline updateObjectByAddingChildrenID={props.updateObjectByAddingChildrenID} setCurrentTextFieldSelected={props.setCurrentTextFieldSelected}  setCurrentObject={props.setCurrentObject} currentObject={props.currentObject} allObject={props.allObject} updateAllObjectWhenCurrentObjectChange={props.updateAllObjectWhenCurrentObjectChange}/> :
                        typeObject === "Surface" ? <Surface updateObjectByAddingChildrenID={props.updateObjectByAddingChildrenID} setCurrentTextFieldSelected={props.setCurrentTextFieldSelected}  setCurrentObject={props.setCurrentObject} currentObject={props.currentObject} allObject={props.allObject} updateAllObjectWhenCurrentObjectChange={props.updateAllObjectWhenCurrentObjectChange}/> :
                            typeObject === "C-Spline" ? <CSpline updateObjectByAddingChildrenID={props.updateObjectByAddingChildrenID} setCurrentTextFieldSelected={props.setCurrentTextFieldSelected}  setCurrentObject={props.setCurrentObject} currentObject={props.currentObject} allObject={props.allObject} updateAllObjectWhenCurrentObjectChange={props.updateAllObjectWhenCurrentObjectChange}/> :
                                typeObject === "Mirrored Point" ? <MirroredPoint updateObjectByAddingChildrenID={props.updateObjectByAddingChildrenID} setCurrentTextFieldSelected={props.setCurrentTextFieldSelected}  setCurrentObject={props.setCurrentObject} currentObject={props.currentObject} allObject={props.allObject} updateAllObjectWhenCurrentObjectChange={props.updateAllObjectWhenCurrentObjectChange}/> :



                    ""
            }
        </div>

    )

}