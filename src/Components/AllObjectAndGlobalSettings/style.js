import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme)=>({
    title: {

        fontSize: "0.875rem !important",
        color:theme.palette.primary.main,
        lineHeight: '1.75',
        letterSpacing: "0.02857em",
    },
    containerTitle:{
        width:"160px",
        justifyContent: "center",
        borderRadius:"0px",
        borderBottom:"solid 2px #3f51b5 !importantx",
    },
    container: {
        paddingBottom:"25px",
        display:"flex",
        flexDirection:"column",
    },
    containerAllObject:{
        margin:"12px 6px",

        flex:"1 0 0",
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

}));

export default useStyles;