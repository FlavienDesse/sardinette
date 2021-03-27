import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Components/Main/main'
import {SnackbarProvider} from "notistack";
import CancelIcon from '@material-ui/icons/Cancel';

const notistackRef = React.createRef();
const onClickDismiss = key => () => {
    notistackRef.current.closeSnackbar(key);
}

ReactDOM.render(
    <SnackbarProvider ref={notistackRef} maxSnack={3}
                      action={(key) => (
                          <CancelIcon  onClick={onClickDismiss(key)}/>

                      )}>
        <Main/>
    </SnackbarProvider>
    ,
    document.getElementById('root')
);


