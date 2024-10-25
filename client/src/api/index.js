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
export const editTeam = (id) => API.patch(`/my-teams/${id}`);
export const deleteTeam = (id) => API.delete(`/my-teams/${id}`);
export const joinTeam = (teamCode) => API.patch(`/my-teams/join-team/${teamCode}`);

export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
export const googleSignIn = (formData) => API.post('/user/googlesignin', formData);