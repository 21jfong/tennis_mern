import * as api from '../api';
import { FETCH_ALL_MATCHES, FETCH, CREATE, UPDATE, DELETE } from '../constants/actionTypes';

export const getMatches = (id) => async (dispatch) => {
  try {
    const { data } = await api.getMatches(id);

    dispatch({ type: FETCH_ALL_MATCHES, payload: data });
  } catch (error) {
    return error;
  }
}