import React, {useRef} from "react";
import * as THREE from "three"
import useStyles from "./style";
import PropTypes from 'prop-types';
import Background from "../../Class/Background";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls"
import {TransformControls} from "three/examples/jsm/controls/TransformControls"


Scene.propType = {
    background: PropTypes.instanceOf(Background).isRequired,
    currentObject:PropTypes.object.isRequired,
    setCurrentObject:PropTypes.func.isRequired,
}

export default function Scene(props) {
    const classes = useStyles();
    const refContainer = useRef();


    const camera = useRef();
    const renderer = useRef();
    const scene = useRef();
    const raycaster  = useRef();

    //This useEffect is for initialisation
    React.useEffect(() => {


        //We get the size of the available space
        let boundingContainer = refContainer.current.getBoundingClientRect()
        let height = boundingContainer.height;
        let width = boundingContainer.width;

        //create camera
        camera.current = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.current.position.z = 5;

        raycaster.current= new THREE.Raycaster();

        renderer.current = new THREE.WebGLRenderer({alpha: true})
        renderer.current.setSize(width, height);

        scene.current = new THREE.Scene()


        //show the plane
        const plane = new THREE.GridHelper(100, 100);


        refContainer.current.appendChild(renderer.current.domElement)


        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial({color: 0xDCDCDC});
        const cube = new THREE.Mesh(geometry, material);
        const light = new THREE.PointLight(0xff0040, 5);
        const sphere = new THREE.SphereGeometry(0.1, 64, 64);

        const controlsElem = new TransformControls(camera.current, renderer.current.domElement)



        light.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: 0xff0040})));

        light.position.set(2, 2, 0);
        scene.current.add(cube);
        scene.current.add(light);
        scene.current.add(plane);


        const controls = new TrackballControls(camera.current, renderer.current.domElement)
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
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;


            renderer.current.render(scene.current, camera.current);
        };
        animate();


    }, [])

    //This one is when size change
    React.useEffect(() => {
        window.addEventListener('resize', updateSize);

        function updateSize() {
            let boundingContainer = refContainer.current.getBoundingClientRect()
            let height = boundingContainer.height;
            let width = boundingContainer.width;
            camera.current.aspect = width / height;
            camera.current.updateProjectionMatrix()
            renderer.current.setSize(width, height)
        }
    }, [])

    //This one is when the settings color change
    React.useEffect(() => {
        let backgroundColor;
        switch (props.background.type) {

            //TOdo add texture
            default:
                backgroundColor = parseInt(props.background.color.replace("#", '0x'), 16)

                scene.current.background = new THREE.Color(backgroundColor)

                break;

        }
        //   renderer.render(scene, camera);
    }, [props.background])

    //This one is when we click on object
    React.useEffect(() => {
        renderer.current.domElement.addEventListener("click", onclick, true);





        function onclick(event) {

            const target = event.target;

            // Get the bounding rectangle of target
            const rectMouse = target.getBoundingClientRect();

            let boundingContainer = refContainer.current.getBoundingClientRect()
            let height = boundingContainer.height;
            let width = boundingContainer.width;

            let mouse = {
                x:  ( (event.clientX - rectMouse.left)/width ) * 2 - 1,
                y: - ( (event.clientY- rectMouse.top )/ height) * 2 + 1,
            }

            raycaster.current.setFromCamera( mouse, camera.current );
            const intersects = raycaster.current.intersectObjects( scene.current.children );
            console.log(intersects)
        }

    }, [])




    return (
        <div ref={refContainer} className={classes.container}>

        </div>
    )

}