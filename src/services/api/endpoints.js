import api from './instance';
import useAuthStore from '../../stores/auth';

// Sessions
export const login = async (credentials) => {
  const { setAuth } = useAuthStore.getState();
  const { data } = await api.post('/login', credentials);

  setAuth(data.accessToken);
  return data;
};
export const logout = async () => {
  const { clearAuth } = useAuthStore.getState();

  try {
    await api.post('/logout');
  } finally {
    clearAuth();
  }
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
export const getUserById = async (_id) => {
  const { data } = await api.get(`/users/${_id}`);

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
export const updateUserByManagement = async ({ _id, newUserData }) => {
  const { data } = await api.put(`/users/management/${_id}`, newUserData);

  return data;
};
export const resetUserPasswordByManagement = async (_id) => {
  const { data } = await api.post(`/users/management/${_id}/reset-password`);

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

// Academic leagues
export const getAcademicLeagues = async (filters = {}) => {
  const { data } = await api.get('/academic-leagues', { params: filters });

  return data;
};
export const getAcademicLeagueById = async (_id) => {
  const { data } = await api.get(`/academic-leagues/${_id}`);

  return data;
};
export const createAcademicLeague = async (newAcademicLeague) => {
  const { data } = await api.post('/academic-leagues', newAcademicLeague);

  return data;
};
export const updateAcademicLeague = async ({ _id, inputData }) => {
  const { data } = await api.patch(`/academic-leagues/${_id}`, inputData);

  return data;
};
export const deleteAcademicLeague = async (_id) => {
  const { data } = await api.delete(`/academic-leagues/${_id}`);

  return data;
};

// League memberships
export const getLeagueMemberships = async (filters = {}) => {
  const { data } = await api.get('/league-memberships', { params: filters });

  return data;
};
export const getLeagueMembershipById = async (_id) => {
  const { data } = await api.get(`/league-memberships/${_id}`);

  return data;
};
export const createLeagueMembership = async (newLeagueMembership) => {
  const { data } = await api.post('/league-memberships', newLeagueMembership);

  return data;
};
export const updateLeagueMembership = async ({ _id, inputData }) => {
  const { data } = await api.patch(`/league-memberships/${_id}`, inputData);

  return data;
};
export const deleteLeagueMembership = async (_id) => {
  const { data } = await api.delete(`/league-memberships/${_id}`);

  return data;
};

// Squads
export const getSquads = async (filters = {}) => {
  const { data } = await api.get('/squads', { params: filters });

  return data;
};
export const getSquadById = async (_id) => {
  const { data } = await api.get(`/squads/${_id}`);

  return data;
};
export const createSquad = async (newSquad) => {
  const { data } = await api.post('/squads', newSquad);

  return data;
};
export const updateSquad = async ({ _id, inputData }) => {
  const { data } = await api.patch(`/squads/${_id}`, inputData);

  return data;
};
export const deleteSquad = async (_id) => {
  const { data } = await api.delete(`/squads/${_id}`);

  return data;
};

// Universities
export const getUniversities = async (filters = {}) => {
  const { data } = await api.get('/universities', { params: filters });

  return data;
};
export const getUniversityById = async (_id) => {
  const { data } = await api.get(`/universities/${_id}`);

  return data;
};
export const createUniversity = async (newUniversity) => {
  const { data } = await api.post('/universities', newUniversity);

  return data;
};
export const updateUniversity = async ({ _id, inputData }) => {
  const { data } = await api.patch(`/universities/${_id}`, inputData);

  return data;
};
export const deleteUniversity = async (_id) => {
  const { data } = await api.delete(`/universities/${_id}`);

  return data;
};

// Events
export const getEvents = async (filters = {}) => {
  const { data } = await api.get('/events', { params: filters });

  return data;
};
export const getEventById = async (_id) => {
  const { data } = await api.get(`/events/${_id}`);

  return data;
};
export const getEventEngagementById = async (_id) => {
  const { data } = await api.get(`/events/${_id}/engagement`);

  return data;
};
export const createEvent = async (newEvent) => {
  const { data } = await api.post('/events', newEvent);

  return data;
};
export const updateEvent = async ({ _id, inputData }) => {
  const { data } = await api.patch(`/events/${_id}`, inputData);

  return data;
};
export const deleteEvent = async (_id) => {
  const { data } = await api.delete(`/events/${_id}`);

  return data;
};

// Certificates
export const getCertificates = async (filters = {}) => {
  const { data } = await api.get('/certificates', { params: filters });

  return data;
};
export const getCertificateById = async (_id) => {
  const { data } = await api.get(`/certificates/${_id}`);

  return data;
};
export const createCertificate = async (newCertificate) => {
  const { data } = await api.post('/certificates', newCertificate);

  return data;
};
export const updateCertificate = async ({ _id, inputData }) => {
  const { data } = await api.patch(`/certificates/${_id}`, inputData);

  return data;
};
export const deleteCertificate = async (_id) => {
  const { data } = await api.delete(`/certificates/${_id}`);

  return data;
};
export const getLatestCertificateByLeagueMembership = async (
  leagueMembership,
) => {
  const { data } = await api.get(
    `/certificates/league-membership/${leagueMembership}/latest`,
  );

  return data;
};
export const getCertificateSummaryByLeagueMembership = async (
  leagueMembership,
) => {
  const { data } = await api.get(
    `/certificates/league-membership/${leagueMembership}/summary`,
  );

  return data;
};

// Attendances
export const getAttendances = async (filters = {}) => {
  const { data } = await api.get('/attendances', { params: filters });

  return data;
};
export const getAttendanceById = async (_id) => {
  const { data } = await api.get(`/attendances/${_id}`);

  return data;
};
export const createAttendance = async (newAttendance) => {
  const { data } = await api.post('/attendances', newAttendance);

  return data;
};
export const updateAttendance = async ({ _id, inputData }) => {
  const { data } = await api.patch(`/attendances/${_id}`, inputData);

  return data;
};
export const deleteAttendance = async (_id) => {
  const { data } = await api.delete(`/attendances/${_id}`);

  return data;
};
export const confirmAttendance = async (_id) => {
  const { data } = await api.patch(`/attendances/${_id}/confirm`);

  return data;
};
export const markAttendance = async ({ _id, hasAttended = true }) => {
  const { data } = await api.patch(`/attendances/${_id}/mark-attended`, {
    hasAttended,
  });

  return data;
};
