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
});

export default useStyles;