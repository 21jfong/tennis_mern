import { MATCH_ACTIONS } from "../constants/actionTypes";
const reduce = (matches = [], action) => {
  switch (action.type) {
    case MATCH_ACTIONS.FETCH_ALL:
      return action.payload;
    case MATCH_ACTIONS.FETCH:
      return action.payload;
    case MATCH_ACTIONS.CREATE:
      return [...matches, action.payload];
    case MATCH_ACTIONS.UPDATE:
      return matches.map((match) => match._id === action.payload._id ? action.payload : match);
    case MATCH_ACTIONS.DELETE:
      return matches.filter((match) => match._id !== action.payload);
    default:
      return matches;
  }
}

export default reduce;
