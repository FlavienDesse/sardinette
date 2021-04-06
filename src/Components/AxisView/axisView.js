import React, {useRef} from "react"
import useStyles from "./style";
import * as THREE from "three"


export default function AxisView(props) {

    const style = useStyles()

    const refContainer = useRef();


    const camera2 = useRef()
    const scene2 = useRef()
    const renderer2 = useRef()




    let animate =React.useCallback((args => {
        requestAnimationFrame(animate);




        camera2.current.position.copy( props.camera.position );
       // camera2.current.position.sub( props.controls.center );
        camera2.current.position.setLength( 200 );
        camera2.current.lookAt( scene2.current.position );

        renderer2.current.render(scene2.current, camera2.current);




    }),[props.camera,props.controls])


    React.useEffect(() => {

        console.log(props.controls)
        let CANVAS_WIDTH = 200, CANVAS_HEIGHT = 200;

        const origin = new THREE.Vector3(0, 0, 0);
        const dirX = new THREE.Vector3(1, 0, 0);
        const dirY = new THREE.Vector3(0, 1, 0);
        const dirZ = new THREE.Vector3(0, 0, 1);

        let tempAxisX = new THREE.ArrowHelper(dirX, origin, 100, 0xff0000);
        let tempAxisY = new THREE.ArrowHelper(dirY, origin, 100, 0x00ff00);
        let tempAxisZ = new THREE.ArrowHelper(dirZ, origin, 100, 0x0000ff);


        renderer2.current = new THREE.WebGLRenderer({alpha: true});
        renderer2.current.setClearColor(0xFFFFFF, 0);
        renderer2.current.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
        refContainer.current.appendChild(renderer2.current.domElement);


        scene2.current = new THREE.Scene();


        camera2.current = new THREE.PerspectiveCamera(75, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000);


        scene2.current.add(tempAxisX);
        scene2.current.add(tempAxisY);
        scene2.current.add(tempAxisZ);

        camera2.current.position.x = 5;


        renderer2.current.render(scene2.current, camera2.current);

        animate();


    },[])




    return (
        <div className={style.container} ref={refContainer}>

        </div>
    )

}