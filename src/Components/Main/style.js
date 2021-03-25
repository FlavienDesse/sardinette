import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
    container: {
        height: '100vh',
        width: '100%',
        display: 'flex',

        flexDirection: 'column',
    },
    containerScene: {
        flex: '1 1 0',
        minWidth: 0,
        minHeight: 0,
        overflow: 'hidden',
    },
    containerSceneAndBoxObject: {
        display: 'flex',
        flex: 1,
        minWidth: 0,
        minHeight: 0,
    },
    containerToolsObject:{
        display: 'flex',
        padding:"5px 16px 5px 16px",
        minWidth: "500px",
        flexDirection:"column",
        '& > :nth-child(1)':{
            flex:"1",
        },
        '& > :nth-child(2)':{
            flex:"1",
        },
    },
});

export default useStyles;