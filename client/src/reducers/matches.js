import { FETCH, FETCH_ALL_MATCHES, CREATE, UPDATE, DELETE } from "../constants/actionTypes";
const reduce = (matches = [], action) => {
  switch (action.type) {
    case FETCH_ALL_MATCHES:
      return action.payload;
    case FETCH:
      return action.payload;
    case CREATE:
      return [...matches, action.payload];
    case UPDATE:
      return matches.map((match) => match._id === action.payload._id ? action.payload : match);
    case DELETE:
      return matches.filter((match) => match._id !== action.payload);
    default:
      return matches;
  }
}

export default reduce;