import * as api from '../api';
import { FETCH_ALL, FETCH, CREATE, UPDATE, DELETE } from '../constants/actionTypes';

export const getTeams = (user) => async (dispatch) => {
  try {
    const { data } = await api.fetchTeams(user);

    dispatch({ type: FETCH_ALL, payload: data });
  } catch (error) {
    return error;
  }
}

export const getTeam = (id) => async (dispatch) => {
  try {
    const { data } = await api.fetchTeam(id);

    dispatch({ type: FETCH, payload: data })
  } catch (error) {
    return error;
  }
}

export const createTeam = (team) => async (dispatch) => {
  try {
    const { data } = await api.createTeam(team);

    dispatch({ type: CREATE, payload: data })
  } catch (error) {
    return error;
  }
}

export const editTeam = (id) => async (dispatch) => {
  try {
    await api.editTeam(id);

    dispatch({ type: UPDATE, payload: id })
  } catch (error) {
    return error;
  }
}

export const deleteTeam = (id) => async (dispatch) => {
  try {
    await api.deleteTeam(id);

    dispatch({ type: DELETE, payload: id })
  } catch (error) {
    return error;
  }
}

export const joinTeam = (teamCode) => async (dispatch) => {
  try {
    await api.joinTeam(teamCode);

    dispatch({ type: UPDATE, payload: teamCode })
  } catch (error) {
    return error;
  }
}
