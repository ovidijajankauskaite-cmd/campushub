import { apiClient } from './client';
import { User, Event, AdminStats } from '../types';

export const getAdminUsers = async () => {
  const { data } = await apiClient.get<User[]>('/admin/users');
  return data;
};

export const getAdminEvents = async () => {
  const { data } = await apiClient.get<Event[]>('/admin/events');
  return data;
};

export const deleteAdminEvent = async (id: string | number) => {
  await apiClient.delete(`/admin/events/${id}`);
};

export const getAdminStats = async () => {
  const { data } = await apiClient.get<AdminStats>('/admin/stats');
  return data;
};
