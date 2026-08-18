import { apiClient } from './client';
import { User, Event, AdminStats, AdminUsersResponse } from '../types';

export const getAdminUsers = async (): Promise<AdminUsersResponse> => {
  const { data } = await apiClient.get<AdminUsersResponse>('/admin/users');
  return data;
};

export const getAdminEvents = async (): Promise<Event[]> => {
  const { data } = await apiClient.get<Event[]>('/admin/events');
  return data;
};

export const deleteAdminEvent = async (id: string | number): Promise<void> => {
  await apiClient.delete(`/admin/events/${id}`);
};

export const getAdminStats = async (): Promise<AdminStats> => {
  const { data } = await apiClient.get<AdminStats>('/admin/stats');
  return data;
};
