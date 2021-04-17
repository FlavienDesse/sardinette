import React from "react";
import {MenuItem, SubMenu} from "rc-menu"
import {exportSTL,exportScene} from "../../../Misc/Export";
import PropTypes from "prop-types";

import {importSTL,importScene} from "../../../Misc/Import";
import {useSnackbar} from "notistack";

OpenFile.propType = {
    scene: PropTypes.any.isRequired,
    setAllObject: PropTypes.func.isRequired,
}

export default function OpenFile(props) {

    const hiddenFileInput = React.useRef(null);

    const {enqueueSnackbar} = useSnackbar();

    const handleClickSaveAs = event => {
        exportScene(props.scene)
    };
    const handleClickOnSTL = () => {
        try{
            exportSTL(props.scene.current)
        }catch (e){
            enqueueSnackbar(e.message, {
                variant: 'error',
            });
        }

    }


    const handleChangeSTL = (event) => {
        importSTL (event,props.scene,props.setAllObject)
    };


    const handleChangeOpen = (event) => {

        importScene(event, props.setAllObject)
    }

    const handleClickHiddenFile = event => {
        hiddenFileInput.current.click();
    };



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

