import React from "react";
import PropTypes from "prop-types";
import Point from "./Point/Point/Point";

TabsObject.propType = {
    setCurrentObject: PropTypes.func.isRequired,
    currentObject: PropTypes.object.isRequired,
    allObject: PropTypes.array.isRequired,
    updateAllObjectWhenCurrentObjectChange: PropTypes.func.isRequired
}

export default function TabsObject(props) {


    const [typeObject, setTypeObject] = React.useState(props.currentObject.type)


    return (
        <div>

            {

                typeObject === "Point" ? <Point   setCurrentObject={props.setCurrentObject} currentObject={props.currentObject} allObject={props.allObject} updateAllObjectWhenCurrentObjectChange={props.updateAllObjectWhenCurrentObjectChange}/> : ""
            }
        </div>

    )

}