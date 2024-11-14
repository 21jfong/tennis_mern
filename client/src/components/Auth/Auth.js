import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid2,
  Button,
  CircularProgress,
} from "@mui/material";
import LockedOutlinedIcon from "@mui/icons-material/LockOutlined";
import Input from "./Input";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signin, signup, googlesignin, checkHealth } from "../../actions/auth";

import {
  StyledAvatar,
  StyledForm,
  StyledPaper,
  StyledSubmit,
  StyledGoogleButton,
} from "./styles";
import Icon from "./Icon";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};
const client_id = process.env.REACT_APP_CLIENT_ID;

const Auth = ({ setIsAlert, setAlertMessage }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAwake = async () => {
      await dispatch(checkHealth());
    };

    checkAwake();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let response = {};

    try {
      setLoading(true);
      if (isSignup) {
        response = await dispatch(signup(formData, navigate));
      } else {
        response = await dispatch(signin(formData, navigate));
      }

      checkForAlert(response);
    } catch (error) {
      checkForAlert(response);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShowPassword = () =>
    setShowPassword((prevShowPassword) => !prevShowPassword);
  const switchMode = () => {
    setIsSignup((prevSU) => !prevSU);
    setShowPassword(false);
  };

  const googleSuccess = async (res) => {
    setLoading(true);
    const decoded = jwtDecode(res.credential);

    const serverIsAvailable = await checkServerAvailability();

    if (!serverIsAvailable) {
      setLoading(false);
      setAlertMessage(
        "Server can take a while to load if this is your first time using it, try again in about a minute."
      );
      setIsAlert(true);
      return;
    }

    try {
      const result = { email: decoded.email, name: decoded.name };

      let response = {};
      response = await dispatch(googlesignin(result, navigate));

      checkForAlert(response);
      dispatch({
        type: "AUTH",
        data: {
          result: { ...response.result, imageURL: decoded.picture },
          token: res.credential,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const googleFailure = () => {
    setAlertMessage("Google Sign In was unsuccessful. Try again later.");
    setIsAlert(true);
  };

  const checkServerAvailability = async () => {
    try {
      const response = await dispatch(checkHealth());

      if (response.result === "OK") {
        return true;
      }
    } catch (error) {
      return false;
    }
  };

  const checkForAlert = (res) => {
    if (res?.status && res.status !== 200) {
      setAlertMessage(res.response.data.message);
      setIsAlert(true);
    }
  };

  if (loading) {
    return (
      <Container component="main" maxWidth="xs">
        <StyledPaper>
          <StyledAvatar>
            <LockedOutlinedIcon />
          </StyledAvatar>
          <Typography variant="h5">Loading...</Typography>
          <CircularProgress size={50} />
          <Typography variant="h6" align="center">
            Server can take a while to load if this is your first time using it,
            please try again in a bit.
          </Typography>
        </StyledPaper>
      </Container>
    );
  }

  return (
    <GoogleOAuthProvider clientId={client_id}>
      <Container component="main" maxWidth="xs">
        <StyledPaper>
          <StyledAvatar>
            <LockedOutlinedIcon />
          </StyledAvatar>
          <Typography variant="h5">
            {isSignup ? "Sign Up" : "Sign In"}
          </Typography>
          <StyledForm onSubmit={handleSubmit}>
            <Grid2 container spacing={2}>
              {isSignup && (
                <>
                  <Input
                    name="firstName"
                    label="First Name"
                    handleChange={handleChange}
                    autoFocus
                    half
                  />
                  <Input
                    name="lastName"
                    label="Last Name"
                    handleChange={handleChange}
                    half
                  />
                </>
              )}
              <Input
                name="email"
                label="Email Address"
                handleChange={handleChange}
                type="email"
              />
              <Input
                name="password"
                label="Password"
                handleChange={handleChange}
                type={showPassword ? "text" : "password"}
                handleShowPassword={handleShowPassword}
              />
              {isSignup && (
                <Input
                  name="confirmPassword"
                  label="Repeat Password"
                  handleChange={handleChange}
                  type="password"
                />
              )}
            </Grid2>
            <StyledSubmit
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
            >
              {isSignup ? "Sign Up" : "Sign In"}
            </StyledSubmit>

            <Grid2
              container
              justifyContent="center"
              alignItems="center"
              style={{ margin: "16px 0" }}
            >
              <GoogleLogin
                render={(renderProps) => (
                  <StyledGoogleButton
                    color="primary"
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
                  {isSignup
                    ? "Already have an account? Sign In"
                    : "Don't have an account? Sign Up"}
                </Button>
              </Grid2>
            </Grid2>
          </StyledForm>
        </StyledPaper>
      </Container>
    </GoogleOAuthProvider>
  );
};

export default Auth;
