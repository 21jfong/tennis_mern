import * as api from '../api';
import { FETCH_ALL, CREATE, UPDATE, DELETE } from '../constants/actionTypes';

export const getTeams = () => async (dispatch) => {
  try {
    const { data } = await api.fetchTeams();

    dispatch({ type: FETCH_ALL, payload: data });
  } catch (error) {
    console.log(error.message);
  }
}

export const createTeam = (team) => async (dispatch) => {
  try {
    const { data } = await api.createTeams(team);

    dispatch({ type: CREATE, payload: data })
  } catch (error) {
    console.log(error);
  }
}

export const deleteTeam = (id) => async (dispatch) => {
  try {
    await api.deleteTeam(id);

    dispatch({ type: DELETE, payload: id })
  } catch (error) {
    console.log(error);
  }
}