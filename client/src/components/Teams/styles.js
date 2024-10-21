import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh' // Ensures full viewport height
  },
  smMargin: {
    margin: 10,
  },
  actionDiv: {
    textAlign: 'center',
  },
}));