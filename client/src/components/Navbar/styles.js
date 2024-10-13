import { deepPurple } from '@mui/material/colors';
import { AppBar, Typography, Toolbar, Avatar, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CustomAppBar = styled(AppBar)(({ theme }) => ({
  borderRadius: 15,
  margin: '30px 0',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 50px',
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
  color: "black"
});

export const CustomAvatar = styled(Avatar)(({ theme }) => ({
  color: theme.palette.getContrastText(deepPurple[500]),
  backgroundColor: deepPurple[500],
}));
