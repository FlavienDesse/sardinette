import React from "react";
import {MenuItem, SubMenu} from "rc-menu"
import {exportSTL} from "../../../Misc/Export";
import PropTypes from "prop-types";
import {STLLoader} from "three/examples/jsm/loaders/STLLoader";
import {DoubleSide, Group, Mesh, MeshBasicMaterial} from "three";
import {GLTFExporter} from "three/examples/jsm/exporters/GLTFExporter";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {saveAs} from 'file-saver';

OpenFile.propType = {
    scene: PropTypes.any.isRequired,
    setAllObject: PropTypes.func.isRequired,
}

export default function OpenFile(props) {

    const hiddenFileInput = React.useRef(null);

    const fileSave = React.useRef(null);

    const handleClickSaveAs = event => {


    };

    const handleClickOpen = event => {

        const loader = new GLTFLoader();

        var reader = new FileReader();
        reader.onload = function (e) {

            loader.parse(e.target.result,undefined,function (event){
                if(props.scene){
                    while(props.scene.children.length > 0){
                        props.scene.remove(props.scene.children[0]);
                    }
                }

                props.scene.add( event.scene );


            })



        }
        if (event.target.files[0]) {
            reader.readAsArrayBuffer(event.target.files[0]);
        }

    };

    const handleClickSave = event => {
        const gltfExporter = new GLTFExporter();
        const options = {
            trs: false,
            onlyVisible: false,
            truncateDrawRange: true,
            binary: false,
            maxTextureSize: Infinity // To prevent NaN value
        };
        gltfExporter.parse(props.scene, function (result) {

            if (result instanceof ArrayBuffer) {
                let blob = new Blob([result], {type: 'text/plain'})
                saveAs(blob, 'scene.glb');

            } else {

                const output = JSON.stringify(result, null, 2);
                let blob = new Blob([output], {type: 'text/plain'})
                saveAs(blob, 'scene.glb');

            }

        }, options);
        //    saveAs(blob, 'file.stl'); //Save the Blob to file.stl
    };


    const handleClickHiddenFile = event => {
        hiddenFileInput.current.click();
    };

    const handleChangeSTL = event => {

        const loader = new STLLoader();
        const group = new Group()


        var reader = new FileReader();

        reader.onload = function (e) {

            props.scene.remove(props.scene.children[1]);

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


            props.scene.add(group);

            props.setAllObject([mesh])


        }
        if (event.target.files[0]) {
            reader.readAsArrayBuffer(event.target.files[0]);
        }


        //props.handleFile(fileUploaded);
    };

    const handleClickOnSTL = () => {
        exportSTL(props.scene)
    }
    let propsSubMenu = Object.assign({}, props)
    delete propsSubMenu.setAllObject
    return (
        <SubMenu popupOffset={[0, 2]} {...propsSubMenu} title={"File"}>
            <MenuItem onClick={handleClickHiddenFile}>
                Import
                <input
                    type="file"
                    ref={hiddenFileInput}
                    onChange={handleChangeSTL}
                    style={{display: 'none'}}
                />
            </MenuItem>

            <SubMenu popupOffset={[0, 2]} title={"Export"}>
                <MenuItem onClick={handleClickOnSTL}>
                    STL
                </MenuItem>
            </SubMenu>
        </SubMenu>
    )

}

