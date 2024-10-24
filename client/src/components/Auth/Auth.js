import React, { useState } from 'react'
import { Container, Typography, Grid2, Button, Alert } from '@mui/material';
import LockedOutlinedIcon from '@mui/icons-material/LockOutlined'
import Input from './Input';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signin, signup, googlesignin } from '../../actions/auth';

import { StyledAvatar, StyledForm, StyledPaper, StyledSubmit, StyledGoogleButton } from './styles';
import Icon from './Icon';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };
const client_id = process.env.REACT_APP_CLIENT_ID;

const Auth = ({ setIsAlert, setAlertMessage }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let response = {}

    if (isSignup) {
      response = await dispatch(signup(formData, navigate));
    } else {
      response = await dispatch(signin(formData, navigate));
    }

    checkForAlert(response);
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
      const result = { ...decoded, googleId: decoded.given_name, imageURL: decoded.picture, firstName: decoded.name.split(" ")[0], lastName: (decoded.name.split(" ")[1] || ""), password: decoded.sub }

      let response = {}
      response = dispatch(googlesignin(result, navigate));
      checkForAlert(response);
      dispatch({ type: 'AUTH', data: { result, token: res.credential } });

      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };
  const googleFailure = () => {
    console.log("Google Sign In was unsuccessful. Try again later.");
    setAlertMessage("Google Sign In was unsuccessful. Try again later.");
    setIsAlert(true);
  };

  const checkForAlert = (res) => {
    if (res?.status && res.status !== 200) {
      setAlertMessage(res.response.data.message);
      setIsAlert(true);
    }
  }

  return (
    <GoogleOAuthProvider clientId={client_id}>
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
            <StyledSubmit type="submit" fullWidth variant="contained" color="secondary" > {isSignup ? 'Sign Up' : 'Sign In'} </StyledSubmit>

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
                <Button color="secondary" onClick={switchMode}>
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
