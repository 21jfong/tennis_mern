import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;
const API = axios.create({ baseURL: API_BASE_URL });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`
  }

  return req;
});

export const fetchTeams = (user) => API.get('/my-teams', user);
export const fetchTeam = (id) => API.get(`/my-teams/${id}`);
export const createTeam = (newTeam) => API.post('/my-teams/create-team', newTeam);
export const editTeam = (teamId, team) => API.patch(`/my-teams/${teamId}/edit-team`, team);
export const deleteTeam = (teamId) => API.delete(`/my-teams/${teamId}/edit-team`);
export const joinTeam = (teamCode) => API.patch(`/my-teams/join-team/${teamCode}`);

export const getMatches = (teamId) => API.get(`/my-teams/${teamId}/matches`);
export const createMatch = (newMatch) => API.post('/matches/create-match', newMatch);

export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
export const googleSignIn = (formData) => API.post('/user/googlesignin', formData);
export const checkHealth = () => API.get('/user/health');
