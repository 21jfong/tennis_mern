import * as api from '../api';
import { TEAM_ACTIONS } from '../constants/actionTypes';

export const getTeams = (user) => async (dispatch) => {
  try {
    const { data } = await api.fetchTeams(user);

    dispatch({ type: TEAM_ACTIONS.FETCH_ALL, payload: data });
  } catch (error) {
    return error;
  }
}

export const getTeam = (id) => async (dispatch) => {
  try {
    const { data } = await api.fetchTeam(id);

    dispatch({ type: TEAM_ACTIONS.FETCH, payload: data })
  } catch (error) {
    return error;
  }
}

export const createTeam = (team) => async (dispatch) => {
  try {
    const { data } = await api.createTeam(team);

    dispatch({ type: TEAM_ACTIONS.CREATE, payload: data })
  } catch (error) {
    return error;
  }
}

export const editTeam = (id, team) => async (dispatch) => {
  try {
    const { data } = await api.editTeam(id, team);

    dispatch({ type: TEAM_ACTIONS.UPDATE, payload: data })
  } catch (error) {
    return error;
  }
}

export const deleteTeam = (id) => async (dispatch) => {
  try {
    await api.deleteTeam(id);

    dispatch({ type: TEAM_ACTIONS.DELETE, payload: id })
  } catch (error) {
    return error;
  }
}

export const joinTeam = (teamCode) => async (dispatch) => {
  try {
    await api.joinTeam(teamCode);

    dispatch({ type: TEAM_ACTIONS.UPDATE, payload: teamCode })
  } catch (error) {
    return error;
  }
}

