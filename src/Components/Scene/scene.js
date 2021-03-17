import React, { useRef} from "react";
import * as THREE from "three"
import useStyles from "./style";


export default function Scene() {
    const classes = useStyles();
    const refContainer = useRef();


    React.useEffect(() => {
        let scene = new THREE.Scene();

        let boundingContainer = refContainer.current.getBoundingClientRect()


        let height = boundingContainer.height;
        let width = boundingContainer.width;


        //Create camera
        let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        refContainer.current.appendChild(renderer.domElement);
        let geometry = new THREE.BoxGeometry(1, 1, 1);
        let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        let cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        camera.position.z = 5;
        let animate = function () {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();


        window.addEventListener('resize', updateSize);


        function updateSize() {
            renderer.clear()
            let boundingContainer = refContainer.current.getBoundingClientRect()
            let height = boundingContainer.height;
            let width = boundingContainer.width;
            camera.aspect =width /height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            renderer.render(scene, camera);

        }




    }, [])






    //Create scene


    return (
        <div ref={refContainer} className={classes.container}>

        </div>
    )

}