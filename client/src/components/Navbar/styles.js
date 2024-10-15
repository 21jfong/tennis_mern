import { deepPurple } from '@mui/material/colors';
import { AppBar, Typography, Toolbar, Avatar, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CustomAppBar = styled(AppBar)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: "#000000",
  height: '64px', // Default margin for desktop
  [theme.breakpoints.down('md')]: { // Adjust for mobile
    height: '56px', // Adjust margin for mobile to match the navbar height
  },
}));

export const Heading = styled(Typography)(({ theme }) => ({
  color: 'rgba(255,255,255, 1)',
  textDecoration: 'none',
  fontSize: "30px",
  [theme.breakpoints.down('md')]: { // Adjust for mobile
    fontSize: "16px",
  },
}));

export const CustomToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'flex-end',
  width: '400px',
});

export const ProfileContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  width: '400px',
});

export const CustomAvatar = styled(Avatar)(({ theme }) => ({
  color: theme.palette.getContrastText(deepPurple[500]),
  backgroundColor: deepPurple[500],
}));

export const CustomButton = styled(Button)(({ theme }) => ({
  fontSize: '1rem', // Default size for larger screens
  [theme.breakpoints.down('md')]: {
    fontSize: '0.7rem', // Smaller size for smaller screens
  },
}));
