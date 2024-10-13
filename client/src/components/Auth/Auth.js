import React, { useState } from 'react'
import { Container, Typography, Grid2, Button } from '@mui/material';
import LockedOutlinedIcon from '@mui/icons-material/LockOutlined'
import Input from './Input';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signin, signup } from '../../actions/auth';

import { StyledAvatar, StyledForm, StyledPaper, StyledSubmit, StyledGoogleButton } from './styles';
import Icon from './Icon';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      dispatch(signup(formData, navigate));
    } else {
      dispatch(signin(formData, navigate));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);
  const switchMode = () => {
    setIsSignup((prevSU) => !prevSU);
    setShowPassword(false);
  };

  const googleSuccess = async (res) => {
    const decoded = jwtDecode(res.credential);

    try {
      const result = { ...decoded, googleId: decoded.given_name }
      dispatch({ type: 'AUTH', data: { result, token: res.credential } });

      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };
  const googleFailure = () => {
    console.log("Google Sign In was unsuccessful. Try again later.");
  };

  return (
    <GoogleOAuthProvider clientId='526443852473-83jii1q50cvv21rlb16la3tnp74tksk0.apps.googleusercontent.com'>
      <Container component="main" maxWidth="xs">
        <StyledPaper>
          <StyledAvatar>
            <LockedOutlinedIcon />
          </StyledAvatar>
          <Typography variant="h5">{isSignup ? "Sign Up" : "Sign In"}</Typography>
          <StyledForm onSubmit={handleSubmit}>
            <Grid2 container spacing={2}>
              {
                isSignup && (
                  <>
                    <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                    <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                  </>
                )
              }
              <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
              <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
              {isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
            </Grid2>
            <StyledSubmit type="submit" fullWidth variant="contained" color="primary" > {isSignup ? 'Sign Up' : 'Sign In'} </StyledSubmit>

            <Grid2 container justifyContent="center" alignItems="center" style={{ margin: '16px 0' }}>
              <GoogleLogin
                render={(renderProps) => (
                  <StyledGoogleButton
                    color='primary'
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    startIcon={<Icon />}
                    variant="contained"
                    fullWidth
                  >
                    Google Sign In
                  </StyledGoogleButton>
                )}
                onSuccess={googleSuccess}
                onError={googleFailure}
                cookiePolicy="single_host_origin"
              />
            </Grid2>
            <Grid2 container justifyContent="flex-end">
              <Grid2>
                <Button onClick={switchMode}>
                  {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </Button>
              </Grid2>
            </Grid2>
          </StyledForm>
        </StyledPaper>
      </Container>
    </GoogleOAuthProvider>
  )
}

export default Auth
