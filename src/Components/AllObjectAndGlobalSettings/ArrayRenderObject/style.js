import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    container: {
        cursor: "pointer",
    },
    redIcon: {
        color: 'red !important',
    },
    selectedText: {
        color: 'white !important',
    },

    selected: {
        backgroundColor: theme.palette.primary.light,

    },
}));

export default useStyles;