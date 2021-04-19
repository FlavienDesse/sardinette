import {STLLoader} from "three/examples/jsm/loaders/STLLoader";
import {Group} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {createSTL} from "./Utils";

const importSTLFromFile = (file, scene, setAllObject) => {
    const loader = new STLLoader()

    loader.load(file, function (geometry) {
        const mesh = createSTL(geometry)
        const group = new Group()
        group.add(mesh)


        scene.current.add(group);

        setAllObject([mesh])
    },)

}


const importSTLFromEvent = (event, scene, setAllObject) => {

    const loader = new STLLoader();
    const group = new Group()


    var reader = new FileReader();


    reader.onload = function (e) {

        scene.current.remove(scene.current.children[1]);
        let geometry = loader.parse(e.target.result);
        const mesh = createSTL(geometry)

        group.add(mesh)


        scene.current.add(group);

        setAllObject([mesh])


    }
    if (event.target.files[0]) {
        reader.readAsArrayBuffer(event.target.files[0]);
    }

};

const importScene = (event, setAllObject) => {


    let reader = new FileReader();
    const gltfLoader = new GLTFLoader();

    const onLoad = (e) => {
        //setAllObject(e.scenes[0].children[0].children)


    }

    reader.onload = function (e) {

        gltfLoader.parse(e.target.result, undefined, onLoad)


    }
    if (event.target.files[0]) {
        reader.readAsArrayBuffer(event.target.files[0]);
    }

};

export {
    importSTLFromEvent, importScene, importSTLFromFile
}