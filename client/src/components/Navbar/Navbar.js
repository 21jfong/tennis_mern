import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material'; // Make sure to import Typography here
import { Link } from 'react-router-dom';
import { CustomAppBar, CustomToolbar, ProfileContainer, CustomAvatar, Heading, CustomButton } from './styles'; // Import styled components
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { googleLogout } from '@react-oauth/google';

import racket_icon from '../../images/racket_icon.png';

function Navbar() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    dispatch({ type: "LOGOUT" })
    googleLogout();
    navigate('/');
    setUser(null);
  }

  useEffect(() => {
    const token = user?.token;
    if (token) {
      const decodedToken = jwtDecode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  return (
    <CustomAppBar position="fixed">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <Box component="img" src={racket_icon} alt="logo" sx={{ marginLeft: '15px', width: '50px', height: 'auto' }} />
        <Heading variant="h6" component="a" href="/">
          TrackEZ
        </Heading>
      </Box>

      <Heading variant="h6" component="a" href="/my-teams">
        My Teams
      </Heading>

      <CustomToolbar>
        {user ? (
          <ProfileContainer>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <CustomAvatar alt={user?.result?.name} src={user?.result?.imageURL}>{user?.result?.name.charAt(0)}</CustomAvatar>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>{user?.result?.name}</Typography>
            </Box>
            <CustomButton size="sm" variant="contained" color="secondary" onClick={logout}>Log out</CustomButton>
          </ProfileContainer>
        ) : (
          <CustomButton component={Link} size="sm" to="/auth" variant="contained" color="secondary">Sign in</CustomButton>
        )}
      </CustomToolbar>
    </CustomAppBar>
  );
}

export default Navbar;
