import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';

export const MainContent = styled(Container)(({ theme }) => ({
  marginTop: '74px', // Default margin for desktop
  [theme.breakpoints.down('sm')]: { // Adjust for mobile
    marginTop: '66px', // Adjust margin for mobile to match the navbar height
  },
}));