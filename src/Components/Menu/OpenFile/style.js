import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
    container:{
        position: "absolute",
        backgroundColor: '#f1f1f1',
        '& > *':{
            display:'block',
            padding: "12px 16px",
        },
        minWidth:"160px",
    }
});

export default useStyles;