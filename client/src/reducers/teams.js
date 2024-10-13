import { FETCH_ALL, CREATE, UPDATE, DELETE } from "../constants/actionTypes";
const reduce = (teams = [], action) => {
  switch (action.type) {
    case FETCH_ALL:
      console.log(action.payload);
      return action.payload;
    case CREATE:
      return [...teams, action.payload];
    case UPDATE:
      return teams.map((post) => post._id === action.payload._id ? action.payload : post);
    case DELETE:
      return teams.filter((post) => post._id !== action.payload);
    default:
      return teams;
  }
}

export default reduce;