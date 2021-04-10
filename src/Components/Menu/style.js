import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    menu: {
        backgroundColor: "initial",
        marginTop: '0px',
        '& *': {

            fontFamily: " \"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
            fontSize: "0.875rem !important",
            color: theme.palette.primary.main,
            lineHeight: '1.75',
            letterSpacing: "0.02857em",
            fontWeight: "300",
            textTransform: "uppercase",
        }


    },
}));

export default useStyles;