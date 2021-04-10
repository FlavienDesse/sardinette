import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
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
        position: 'relative',
    },
    containerSceneAndBoxObject: {
        display: 'flex',
        flex: 1,
        minWidth: 0,
        minHeight: 0,
    },
    containerToolsObject: {
        display: 'flex',
        padding: "5px 16px 5px 16px",
        width: "500px",
        flexDirection: "column",
        '& > :nth-child(1)': {
            flex: "1",
        },
        '& > :nth-child(2)': {
            flex: "1",
        },
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%)`,
    },
    buttonModal: {
        marginRight: '15px',
    },
    containerButton: {
        marginTop: '20px',
        textAlign: "right",
    },
}));

export default useStyles;