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
    checkBox:{
      padding:'0px',
    },
    popoverColorPicker:{
        position:'absolute',
        zIndex: '2000',
        transform: "translateX(-50%) translateX(15px)", //15px correspoding to the padding of containerColorPicker
    },
});

export default useStyles;