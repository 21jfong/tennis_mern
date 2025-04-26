// actionTypes.js

const createActionTypes = (base) => ({
  CREATE: `${base}_CREATE`,
  UPDATE: `${base}_UPDATE`,
  DELETE: `${base}_DELETE`,
  FETCH_ALL: `${base}_FETCH_ALL`,
  FETCH: `${base}_FETCH`,
});

// Auth Actions
export const AUTH = "AUTH";
export const LOGOUT = "LOGOUT";
export const HEALTH = "HEALTH";

// Player Actions
export const PLAYER_ACTIONS = createActionTypes("PLAYER");

// Team Actions
export const TEAM_ACTIONS = createActionTypes("TEAM");

// Match Actions
export const MATCH_ACTIONS = createActionTypes("MATCH");
