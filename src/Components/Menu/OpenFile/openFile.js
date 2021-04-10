import React from "react";
import {MenuItem, SubMenu} from "rc-menu"
import {exportSTL} from "../../../Misc/Export";
import PropTypes from "prop-types";
import {STLLoader} from "three/examples/jsm/loaders/STLLoader";
import * as THREE from "three";
import {Group, Mesh} from "three";

OpenFile.propType = {
    scene: PropTypes.any.isRequired,
    setAllObject: PropTypes.func.isRequired,
}

export default function OpenFile(props) {

    const hiddenFileInput = React.useRef(null);

    const handleClick = event => {
        hiddenFileInput.current.click();
    };

    const handleChange = event => {

        const loader = new STLLoader();
        const group = new Group()


        var reader = new FileReader();

        reader.onload = function (e) {

            props.scene.remove(props.scene.children[1]);

            let geometry = loader.parse(e.target.result);
            const material = new THREE.MeshBasicMaterial({
                color: 0x999999,
                opacity: 0.5,
                transparent: true,
                side: THREE.DoubleSide
            });
            const mesh = new Mesh(geometry, material);

            mesh.type = "Import STL"

            group.add(mesh)


            props.scene.add(group);

            props.setAllObject([mesh])


        }
        reader.readAsArrayBuffer(event.target.files[0]);


        //props.handleFile(fileUploaded);
    };

    const handleClickOnSTL = () => {
        exportSTL(props.scene)
    }
    let propsSubMenu = Object.assign({}, props)
    delete propsSubMenu.setAllObject
    return (
        <SubMenu popupOffset={[0, 2]} {...propsSubMenu} title={"File"}>
            <MenuItem onClick={handleClick}>
                Import
                <input
                    type="file"
                    ref={hiddenFileInput}
                    onChange={handleChange}
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

