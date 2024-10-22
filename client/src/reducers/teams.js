import { FETCH, FETCH_ALL, CREATE, UPDATE, DELETE } from "../constants/actionTypes";
const reduce = (teams = [], action) => {
  switch (action.type) {
    case FETCH_ALL:
      return action.payload;
    case FETCH:
      return action.payload;
    case CREATE:
      return [...teams, action.payload];
    case UPDATE:
      return teams.map((team) => team.teamCode === action.payload.teamCode ? action.payload : team);
    case DELETE:
      return teams.filter((team) => team._id !== action.payload);
    default:
      return teams;
  }
}

export default reduce;