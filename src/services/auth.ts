import apiClient from '../api';

export const signup = async (name: string, email: string, password: string) => {
  const response = await apiClient.post(`/api/auth/user`, {
    authType: 'APPLICANT',
    info: {
      type: 'APPLICANT',
      name,
      email,
      password,
      successCode: 'string',
    },
  });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await apiClient.post(`/api/auth/user/session`, {
    email,
    password,
  });
  return response.data;
};

export const getUserInfo = async (token: string) => {
  const response = await apiClient.get(`/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
