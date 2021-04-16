import {STLLoader} from "three/examples/jsm/loaders/STLLoader";
import {DoubleSide, Group, Mesh, MeshBasicMaterial} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

const importSTL = (event, scene, setAllObject) => {

    const loader = new STLLoader();
    const group = new Group()


    var reader = new FileReader();

    reader.onload = function (e) {

        scene.remove(scene.children[1]);

        let geometry = loader.parse(e.target.result);
        const material = new MeshBasicMaterial({
            color: 0x999999,
            opacity: 0.5,
            transparent: true,
            side: DoubleSide
        });
        const mesh = new Mesh(geometry, material);

        mesh.type = "Import STL"

        group.add(mesh)


        scene.add(group);

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
        console.log(e.scenes[0].children[0].children)
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
    importSTL, importScene
}