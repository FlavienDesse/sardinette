import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
    text: {
        width: '100px',

    },

    inputTextField:{
        width: '200px',
    },
    containerRow: {
        marginTop:'20px',
        display: 'flex',
        alignItems: 'center',
    },

    inputTextFieldPosition:{
        width: '50px',
        marginRight: '25px',
    },
});

export default useStyles;