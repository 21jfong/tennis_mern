import { AUTH_PLAYER_ACTIONS } from "../constants/actionTypes";
const reduce = (user = [], action) => {
  switch (action.type) {
    case AUTH_PLAYER_ACTIONS.FETCH:
      return action.payload;
    case AUTH_PLAYER_ACTIONS.CREATE:
      return [...user, action.payload];
    case AUTH_PLAYER_ACTIONS.UPDATE:
      return action.payload;
    case AUTH_PLAYER_ACTIONS.DELETE:
      return user.filter((team) => team._id !== action.payload);
    default:
      return user;
  }
};

export default reduce;
