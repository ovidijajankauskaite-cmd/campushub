import { apiClient } from './client';
import { Group } from '../types';

export const getGroups = async () => {
  const { data } = await apiClient.get<Group[]>('/groups');
  return data;
};

export const getGroup = async (id: string | number) => {
  const { data } = await apiClient.get<Group>(`/groups/${id}`);
  return data;
};

export const createGroup = async (group: Omit<Group, 'id' | 'ownerId' | 'createdAt'>) => {
  const { data } = await apiClient.post<Group>('/groups', group);
  return data;
};

export const joinGroup = async (id: string | number) => {
  await apiClient.post(`/groups/${id}/join`);
};

export const leaveGroup = async (id: string | number) => {
  await apiClient.delete(`/groups/${id}/leave`);
};
