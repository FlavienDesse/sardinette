import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({

    container: {
        padding: "5px",
        display: "flex",
        '& > :not(:last-child) ': {
            borderRight: 'solid black 2px'
        },

    },

    section: {
        display:"flex",
        alignItems: "center",
        justifyContent: "center",
        '& *': {
            padding: "5px",
        }
    },

});

export default useStyles;