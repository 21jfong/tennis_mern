import * as api from '../api';
import { MATCH_ACTIONS } from '../constants/actionTypes';

export const getMatches = (id) => async (dispatch) => {
  try {
    const { data } = await api.getMatches(id);

    dispatch({ type: MATCH_ACTIONS.FETCH_ALL, payload: data });
  } catch (error) {
    return error;
  }
}

export const createMatch = (match) => async (dispatch) => {
  try {
    const { data } = await api.createMatch(match);

    dispatch({ type: MATCH_ACTIONS.CREATE, payload: data })
  } catch (error) {
    return error;
  }
}
