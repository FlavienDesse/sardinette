import React from "react";
import PropTypes from "prop-types";
import Point from "./Point/Point/point"
import BSpline from "./Curve/B-Spline/bSpline";
import Surface from "./Surfaces/Surface/surface";
import CSpline from "./Curve/C-Spline/cSpline";
import MirroredPoint from "./Point/MirroredPoint/mirroredPoint";
import MirroredCurve from "./Curve/Mirrored Curve/mirroredCurve";
import NURBS from "./Curve/NURBS/NURBS";
import Bezier from "./Curve/Bezier/bezier";

TabsObject.propType = {
    setCurrentObject: PropTypes.func.isRequired,
    currentObject: PropTypes.object.isRequired,
    allObject: PropTypes.array.isRequired,
    updateAllObjectWhenCurrentObjectChange: PropTypes.func.isRequired,
    setCurrentTextFieldSelected: PropTypes.func.isRequired,
    updateObjectByAddingChildrenID: PropTypes.func.isRequired,
    setAllObject: PropTypes.func.isRequired,
}

export default function TabsObject(props) {

    return (
        <div>

            {

                props.currentObject.type === "Point" ?
                    <Point setCurrentObject={props.setCurrentObject} currentObject={props.currentObject}
                           allObject={props.allObject}
                           updateAllObjectWhenCurrentObjectChange={props.updateAllObjectWhenCurrentObjectChange}/> :
                    props.currentObject.type === "B-Spline" ? <BSpline setAllObject={props.setAllObject}
                                                                       setCurrentTextFieldSelected={props.setCurrentTextFieldSelected}
                                                                       setCurrentObject={props.setCurrentObject}
                                                                       currentObject={props.currentObject}
                                                                       allObject={props.allObject}
                                                                       updateAllObjectWhenCurrentObjectChange={props.updateAllObjectWhenCurrentObjectChange}/> :
                        props.currentObject.type === "Surface" ? <Surface setAllObject={props.setAllObject}
                                                                          setCurrentTextFieldSelected={props.setCurrentTextFieldSelected}
                                                                          setCurrentObject={props.setCurrentObject}
                                                                          currentObject={props.currentObject}
                                                                          allObject={props.allObject}
                                                                          updateAllObjectWhenCurrentObjectChange={props.updateAllObjectWhenCurrentObjectChange}/> :
                            props.currentObject.type === "C-Spline" ? <CSpline setAllObject={props.setAllObject}
                                                                               setCurrentTextFieldSelected={props.setCurrentTextFieldSelected}
                                                                               setCurrentObject={props.setCurrentObject}
                                                                               currentObject={props.currentObject}
                                                                               allObject={props.allObject}
                                                                               updateAllObjectWhenCurrentObjectChange={props.updateAllObjectWhenCurrentObjectChange}/> :
                                props.currentObject.type === "Mirrored Point" ?
                                    <MirroredPoint setAllObject={props.setAllObject}
                                                   setCurrentTextFieldSelected={props.setCurrentTextFieldSelected}
                                                   setCurrentObject={props.setCurrentObject}
                                                   currentObject={props.currentObject} allObject={props.allObject}
                                                   updateAllObjectWhenCurrentObjectChange={props.updateAllObjectWhenCurrentObjectChange}/> :
                                    props.currentObject.type === "Mirrored Curve" ?
                                        <MirroredCurve setAllObject={props.setAllObject}
                                                       setCurrentTextFieldSelected={props.setCurrentTextFieldSelected}
                                                       setCurrentObject={props.setCurrentObject}
                                                       currentObject={props.currentObject} allObject={props.allObject}
                                                       updateAllObjectWhenCurrentObjectChange={props.updateAllObjectWhenCurrentObjectChange}/> :
                                        props.currentObject.type === "NURBS" ? <NURBS setAllObject={props.setAllObject}
                                                                                      setCurrentTextFieldSelected={props.setCurrentTextFieldSelected}
                                                                                      setCurrentObject={props.setCurrentObject}
                                                                                      currentObject={props.currentObject}
                                                                                      allObject={props.allObject}
                                                                                      updateAllObjectWhenCurrentObjectChange={props.updateAllObjectWhenCurrentObjectChange}/> :
                                            props.currentObject.type === "Bezier" ? <Bezier setAllObject={props.setAllObject}
                                                                                          setCurrentTextFieldSelected={props.setCurrentTextFieldSelected}
                                                                                          setCurrentObject={props.setCurrentObject}
                                                                                          currentObject={props.currentObject}
                                                                                          allObject={props.allObject}
                                                                                          updateAllObjectWhenCurrentObjectChange={props.updateAllObjectWhenCurrentObjectChange}/> :


                                            ""
            }
        </div>

    )

}