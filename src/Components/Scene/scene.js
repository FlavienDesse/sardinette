import React, {useRef} from "react";
import * as THREE from "three"
import useStyles from "./style";
import PropTypes from 'prop-types';
import Background from "../../Class/Background";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls"
import {modifyObjectWhenClickOn} from "../../Class/Utils";
import {TransformControls} from "three/examples/jsm/controls/TransformControls"


Scene.propType = {
    background: PropTypes.instanceOf(Background).isRequired,
    currentObject: PropTypes.object.isRequired,
    allObject: PropTypes.array.isRequired,
    setCurrentObject: PropTypes.func.isRequired,
    setCurrentTextFieldSelected: PropTypes.func.isRequired,
    currentTextFieldSelected: PropTypes.object.isRequired,
    updateAllObjectWhenCurrentObjectChange: PropTypes.func.isRequired,
}

export default function Scene(props) {
    const classes = useStyles();
    const refContainer = useRef();




    const handleMove = React.useCallback((event) => {
        let lastValue = props.currentObject;
        let newValue = event.target.object


        props.updateAllObjectWhenCurrentObjectChange(lastValue, newValue, true)
        props.setCurrentObject(newValue)
        props.control.current.attach(props.currentObject);

    }, [props.currentObject])


    React.useEffect(() => {

        if (props.currentObject && props.currentObject.type === "Point") {
            props.control.current.attach(props.currentObject);
            props.control.current.addEventListener('objectChange', handleMove);
            return () => {
                props.control.current.removeEventListener('objectChange', handleMove);
            };
        }


    }, [handleMove])

    //This useEffect is for initialisation
    React.useEffect(() => {

        const group = new THREE.Group();
        //We get the size of the available space
        let boundingContainer = refContainer.current.getBoundingClientRect()
        let height = boundingContainer.height;
        let width = boundingContainer.width;
        //create camera
        props.camera.current = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        props.camera.current.position.z = 5;

        props.raycaster.current = new THREE.Raycaster();
        props.raycaster.current.params.Line.threshold = 0.1;
        props.renderer.current = new THREE.WebGLRenderer({alpha: true})
        props.renderer.current.setSize(width, height);

        props.scene.current = new THREE.Scene()


        refContainer.current.appendChild(props.renderer.current.domElement)

        const controls = new TrackballControls(props.camera.current, props.renderer.current.domElement)
        props.control.current = new TransformControls(props.camera.current, props.renderer.current.domElement);

        group.add(props.control.current)

        props.scene.current.add(group);
        props.scene.current.add(new THREE.Group());




        props.control.current.addEventListener('dragging-changed', function (event) {
            controls.enabled = !event.value;


        });
        // controls.addEventListener('change', () => console.log("Controls Change"))
        // controls.addEventListener('start', () => console.log("Controls Start Event"))
        // controls.addEventListener('end', () => console.log("Controls End Event"))
        // controls.enabled = false
        // controls.rotateSpeed = 1.0;
        // controls.zoomSpeed = 1.2;
        // controls.panSpeed = 0.8;
        // controls.keys = [65, 83, 68]
        // controls.noPan = true //default false
        // controls.noRotate = true //default false
        // controls.noZoom = true //default false
        // controls.staticMoving = true //default false
        // controls.maxDistance = 4;
        // controls.minDistance = 2;

        let animate = function () {
            requestAnimationFrame(animate);
            controls.update()


            props.renderer.current.render(props.scene.current, props.camera.current);
        };
        animate();


    }, [])

    React.useEffect(() => {

        if (props.currentObject === null) {
            props.control.current.detach(props.currentObject);
        }

    }, [props.currentObject])


    //This one is when size change
    React.useEffect(() => {
        window.addEventListener('resize', updateSize);

        function updateSize() {
            let boundingContainer = refContainer.current.getBoundingClientRect()
            let height = boundingContainer.height;
            let width = boundingContainer.width;
            props.camera.current.aspect = width / height;
            props.camera.current.updateProjectionMatrix()
            props.renderer.current.setSize(width, height)
        }
    }, [])

    //This one is when the settings color change
    React.useEffect(() => {
        let backgroundColor;
        switch (props.background.type) {

            //TOdo add texture
            default:
                backgroundColor = parseInt(props.background.color.replace("#", '0x'), 16)

                props.scene.current.background = new THREE.Color(backgroundColor)

                break;

        }
        //   renderer.render(scene, camera);
    }, [props.background])


    const handleClickOnCanvas = React.useCallback((event) => {
        const target = event.target;

        // Get the bounding rectangle of target
        const rectMouse = target.getBoundingClientRect();

        let boundingContainer = refContainer.current.getBoundingClientRect()
        let height = boundingContainer.height;
        let width = boundingContainer.width;

        let mouse = {
            x: ((event.clientX - rectMouse.left) / width) * 2 - 1,
            y: -((event.clientY - rectMouse.top) / height) * 2 + 1,
        }
        props.raycaster.current.setFromCamera(mouse, props.camera.current);
        const intersects = props.raycaster.current.intersectObjects([...props.allObject]);
        if (!props.control.current.dragging) {
            if (intersects.length > 0) {
                if (props.currentTextFieldSelected !== null && props.currentTextFieldSelected.id !== intersects[0].object.id && props.currentTextFieldSelected.acceptType.includes(intersects[0].object.type)) {
                    if (event.ctrlKey) {
                        event.preventDefault();
                        props.currentTextFieldSelected.clickCtrl(intersects[0].object)
                    } else {
                        event.preventDefault();
                        props.currentTextFieldSelected.simpleClick(intersects[0].object)
                    }
                } else {
                    props.setCurrentObject(modifyObjectWhenClickOn(intersects[0].object, props.currentObject))
                }

            } else {

                if (props.currentTextFieldSelected !== null) {
                    event.preventDefault();
                } else {
                    props.setCurrentObject(modifyObjectWhenClickOn(null, props.currentObject))

                }
            }

        }
    }, [props]);


    //This one is when we click on object
    React.useEffect(() => {
        props.renderer.current.domElement.addEventListener('pointerdown', handleClickOnCanvas, false);


        return () => {
            props.renderer.current.domElement.removeEventListener('pointerdown', handleClickOnCanvas, false);
        };

    }, [handleClickOnCanvas])

    //This one is when the list changed
    React.useEffect(() => {


        //TODO opti
        props.scene.current.remove(props.scene.current.children[1]);

        const group = new THREE.Group();

        props.allObject.forEach(elem => {
            //TODO opti
            if (!elem.isError) {
                group.add(elem)


            }

        });
        props.scene.current.add(group)

    }, [props.allObject])


    return (
        <div ref={refContainer} className={classes.container}>

        </div>
    )

}