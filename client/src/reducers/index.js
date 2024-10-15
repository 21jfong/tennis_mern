import { combineReducers } from "redux";

import auth from './auth';
import teams from './teams';

export default combineReducers({auth, teams});