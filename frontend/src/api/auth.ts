import { apiClient } from './client';
import { User } from '../types';

export const login = async (credentials: any) => {
  const { data } = await apiClient.post<{ token: string; user: User }>('/auth/login', credentials);
  return data;
};

export const register = async (userData: any) => {
  const { data } = await apiClient.post<User>('/auth/register', userData);
  return data;
};

export const logout = async () => {
  await apiClient.post('/auth/logout');
};
