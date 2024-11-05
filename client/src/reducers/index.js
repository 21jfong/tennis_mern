import { combineReducers } from "redux";

import auth from './auth';
import teams from './teams';
import matches from './matches';

export default combineReducers({auth, teams, matches});
