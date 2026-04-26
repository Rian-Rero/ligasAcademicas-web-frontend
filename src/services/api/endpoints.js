import api from './instance';
import useAuthStore from '../../stores/auth';

// User sessions
export const login = async (credentials) => {
  const { setAuth } = useAuthStore.getState();
  const { data } = await api.post('/login', credentials);

  setAuth(data.accessToken);
  return data;
};
export const logout = async () => {
  const { clearAuth } = useAuthStore.getState();
  await api.post('/logout');

  clearAuth();
};
export async function refresh() {
  const { setAuth } = useAuthStore.getState();
  const { data } = await api.get('/refresh');

  setAuth(data.accessToken);
  return data;
}

// Users
export const getUsers = async (filters = {}) => {
  const { data } = await api.get('/users', { params: filters });

  return data;
};

export const createUser = async (newUser) => {
  const { data } = await api.post('/users', newUser);

  return data;
};
export const verifyEmail = async (token) => {
  const { data } = await api.put(`/users/confirm-email/${token}`);

  return data;
};
export const updateUser = async ({ _id, newUserData }) => {
  const { data } = await api.put(`/users/${_id}`, newUserData);

  return data;
};
export const deleteUser = async (_id) => {
  const { data } = await api.delete(`/users/${_id}`);

  return data;
};
export const forgotPassword = async (email) => {
  const { data } = await api.post(`/users/forgot-password`, { email });

  return data;
};
export const redefinePassword = async ({ token, password }) => {
  const { data } = await api.put(`/users/forgot-password/${token}`, {
    newPassword: password,
  });

  return data;
};

// League memberships
export const getLeagueMemberships = async (filters = {}) => {
  const { data } = await api.get('/league-memberships', { params: filters });

  return data;
};

// Academic leagues
export const getAcademicLeagues = async (filters = {}) => {
  const { data } = await api.get('/academic-leagues', { params: filters });

  return data;
};

// Squads
export const getSquads = async (filters = {}) => {
  const { data } = await api.get('/squads', { params: filters });

  return data;
};

// Universities
export const getUniversities = async (filters = {}) => {
  const { data } = await api.get('/universities', { params: filters });

  return data;
};

// Events
export const getEvents = async (filters = {}) => {
  const { data } = await api.get('/events', { params: filters });

  return data;
};
