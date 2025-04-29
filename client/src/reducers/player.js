import { PLAYER_ACTIONS } from "../constants/actionTypes";
const reduce = (user = [], action) => {
  switch (action.type) {
    case PLAYER_ACTIONS.FETCH:
      return action.payload;
    case PLAYER_ACTIONS.CREATE:
      return [...user, action.payload];
    case PLAYER_ACTIONS.UPDATE:
      return [...user, action.payload];
    case PLAYER_ACTIONS.DELETE:
      return user.filter((team) => team._id !== action.payload);
    default:
      return user;
  }
};

export default reduce;
