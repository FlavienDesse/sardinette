import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme)=>({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        top:'50%',
        left:'50%',
        transform: `translate(-50%, -50%)`,
    },
    button:{
      marginRight:'15px',
    },
    containerButton:{
        marginTop:'20px',
      textAlign:"right",
    },
}));

export default useStyles;