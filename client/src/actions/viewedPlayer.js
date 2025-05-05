import { VIEWED_PLAYER_ACTIONS } from "../constants/actionTypes.js";
import * as api from "../api/index.js";

export const getViewedPlayer = (id) => async (dispatch) => {
  try {
    const { data } = await api.fetchPlayer(id);
    dispatch({ type: VIEWED_PLAYER_ACTIONS.FETCH, payload: data });
  } catch (error) {
    console.error(error);
  }
};
