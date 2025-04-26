import { AUTH, HEALTH } from "../constants/actionTypes.js";
import * as api from "../api/index.js";

export const signin = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);

    dispatch({ type: AUTH, data });

    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  } catch (error) {
    return error;
  }
};

export const signup = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);

    dispatch({ type: AUTH, data });

    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
    return data;
  } catch (error) {
    return error;
  }
};

export const googlesignin = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.googleSignIn(formData);

    dispatch({ type: AUTH, data });

    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
    return data;
  } catch (error) {
    return error;
  }
};

export const checkHealth = () => async (dispatch) => {
  try {
    const { data } = await api.checkHealth();

    dispatch({ type: HEALTH, data });
    return data;
  } catch (error) {
    return error;
  }
};
