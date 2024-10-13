import { deepPurple } from '@mui/material/colors';
import { AppBar, Typography, Toolbar, Avatar, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CustomAppBar = styled(AppBar)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 50px',
  backgroundColor: "#1b1b1b",
  height: '64px', // Default margin for desktop
  [theme.breakpoints.down('sm')]: { // Adjust for mobile
    marginTop: '56px', // Adjust margin for mobile to match the navbar height
  },
}));

export const Heading = styled(Typography)({
  color: 'rgba(255,255,255, 1)',
  textDecoration: 'none',
});

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
