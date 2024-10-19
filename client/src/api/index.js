import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`
  }

  return req;
});

// export const fetchPosts = () => API.get('/posts');
// export const createPosts = (newPost) => API.post('/posts', newPost);
// export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
// export const deletePost = (id) => API.delete(`/posts/${id}`);
// export const likePost = (id) => API.patch(`/posts/${id}/likePost`);

export const fetchTeams = (user) => API.get('/my-teams', user);
export const createTeam = (newTeam) => API.post('/my-teams/create-team', newTeam);
export const deleteTeam = (id) => API.delete(`/my-teams/${id}`);

export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
export const googleSignIn = (formData) => API.post('/user/googlesignin', formData);