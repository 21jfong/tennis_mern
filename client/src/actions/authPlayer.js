import { AUTH_PLAYER_ACTIONS } from "../constants/actionTypes.js";
import * as api from "../api/index.js";

export const getAuthPlayer = (id) => async (dispatch) => {
  try {
    const { data } = await api.fetchPlayer(id);

    dispatch({ type: AUTH_PLAYER_ACTIONS.FETCH, payload: data });
  } catch (error) {
    return error;
  }
};

export const updateAuthPlayer = (id, player) => async (dispatch) => {
  try {
    const { data } = await api.editPlayer(id, player);

    dispatch({ type: AUTH_PLAYER_ACTIONS.UPDATE, payload: data });
  } catch (error) {
    return error;
  }
};
