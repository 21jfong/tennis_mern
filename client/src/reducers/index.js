import { combineReducers } from "redux";

import auth from "./auth";
import teams from "./teams";
import matches from "./matches";
import authPlayer from "./authPlayer";
import viewedPlayer from "./viewedPlayer";

export default combineReducers({
  auth,
  teams,
  matches,
  authPlayer,
  viewedPlayer,
});
