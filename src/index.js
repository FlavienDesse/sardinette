import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Components/Main/main'
import {SnackbarProvider} from "notistack";

ReactDOM.render(
    <SnackbarProvider maxSnack={3}>
    <Main />
    </SnackbarProvider>
 ,
  document.getElementById('root')
);


