import { AUTH } from "../constants/actionTypes";
import * as api from "../api/index.js";

const isHomePageOrExternal =
  !document.referrer || !document.referrer.includes(window.location.hostname);

export const signin = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);

    dispatch({ type: AUTH, data });

    if (!isHomePageOrExternal) {
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

    if (!isHomePageOrExternal) {
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

    if (!isHomePageOrExternal) {
      navigate(-1);
    } else {
      navigate("/");
    }
    return data;
  } catch (error) {
    return error;
  }
};
