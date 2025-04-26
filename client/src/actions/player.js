import { PLAYER_ACTIONS } from "../constants/actionTypes.js";
import * as api from "../api/index.js";

export const getPlayer = (id) => async (dispatch) => {
  try {
    const { data } = await api.fetchPlayer(id);

    dispatch({ type: PLAYER_ACTIONS.FETCH, payload: data });
  } catch (error) {
    return error;
  }
};
