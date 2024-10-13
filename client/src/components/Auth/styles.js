import { Avatar, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { deepPurple } from '@mui/material/colors';

// Styled Components
export const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: deepPurple[500],
}));

export const StyledSubmit = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

export const StyledGoogleButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const StyledForm = styled('form')(({ theme }) => ({
  width: '100%', // Fix IE 11 issue.
  marginTop: theme.spacing(3),
}));