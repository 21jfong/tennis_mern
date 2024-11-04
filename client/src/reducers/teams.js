import { TEAM_ACTIONS } from "../constants/actionTypes";
const reduce = (teams = [], action) => {
  switch (action.type) {
    case TEAM_ACTIONS.FETCH_ALL:
      return action.payload;
    case TEAM_ACTIONS.FETCH:
      return action.payload;
    case TEAM_ACTIONS.CREATE:
      return [...teams, action.payload];
    case TEAM_ACTIONS.UPDATE:
      return teams.map((team) => team.teamCode === action.payload.teamCode ? action.payload : team);
    case TEAM_ACTIONS.DELETE:
      return teams.filter((team) => team._id !== action.payload);
    default:
      return teams;
  }
}

export default reduce;