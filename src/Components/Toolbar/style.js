import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({

    container:{
        display:"flex",
        '& > :not(:last-child) ':{
            borderRight:'solid black 2px'
        },

    },

    section:{
      '& *':{
          padding:"5px",
      }
    },

});

export default useStyles;