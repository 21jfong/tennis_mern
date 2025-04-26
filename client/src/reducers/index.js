import { combineReducers } from "redux";

import auth from "./auth";
import teams from "./teams";
import matches from "./matches";
import player from "./player";

export default combineReducers({ auth, teams, matches, player });
