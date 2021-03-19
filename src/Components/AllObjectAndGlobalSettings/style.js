import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
    title: {

        fontSize: "0.875rem",
        color: "#3f51b5",
        lineHeight: '1.75',
        letterSpacing: "0.02857em",
    },
    containerTitle:{
        width:"160px",
        justifyContent: "center",
        borderRadius:"0px",
        borderBottom:"solid 2px #3f51b5",
    },
    container: {
        paddingBottom:"25px",
        display:"flex",
        flexDirection:"column",
    },
    containerAllObject:{
        margin:"12px 16px",
        backgroundColor:"grey",
        flex:1,
    },
    select:{
        minWidth:'150px',
    },
    popoverColorPicker:{
        position:'absolute',
        zIndex: '2000',
        transform: "translateX(-50%) translateX(15px)", //15px correspoding to the padding of containerColorPicker
    },
    containerColorPicker:{
        position:"relative",
        paddingLeft:'15px',
      display:"inline-block",
    },

});

export default useStyles;