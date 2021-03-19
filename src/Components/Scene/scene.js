import React, {useRef} from "react";
import * as THREE from "three"
import useStyles from "./style";
import PropTypes from 'prop-types';
import Background from "../../Class/Background";


Scene.propType = {
    background: PropTypes.instanceOf(Background).isRequired
}

export default function Scene(props) {
    const classes = useStyles();
    const refContainer = useRef();


    const camera = useRef();
    const renderer = useRef();
    const scene = useRef();


    //This useEffect is for initialisation
    React.useEffect(() => {


        let boundingContainer = refContainer.current.getBoundingClientRect()

        let height = boundingContainer.height;
        let width = boundingContainer.width;

        camera.current = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.current.position.z = 5;


        renderer.current = new THREE.WebGLRenderer({alpha: true})
        scene.current = new THREE.Scene()

        renderer.current.setSize(width, height);
        refContainer.current.appendChild(renderer.current.domElement)
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const cube = new THREE.Mesh(geometry, material);
        scene.current.add(cube);


        let animate = function () {
            requestAnimationFrame(animate);
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
            renderer.current.setSize(width,height)
        }
    }, [])

    //This one is when the settings color change
    React.useEffect(() => {
        let backgroundColor;
        switch (props.background.type) {

            case "Color":
                backgroundColor = parseInt(props.background.color.replace("#", '0x'), 16)

                scene.current.background = new THREE.Color(backgroundColor)


                break;
            default:
                backgroundColor = parseInt(props.background.color.replace("#", '0x'), 16)

                scene.current.background = new THREE.Color(backgroundColor)

                break;

        }
        //   renderer.render(scene, camera);
    }, [props.background])


    //Create scene


    return (
        <div ref={refContainer} className={classes.container}>

        </div>
    )

}