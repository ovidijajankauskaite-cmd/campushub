import { apiClient } from './client';
import { Group, CreateGroupPayload } from '../types';

export const getGroups = async (): Promise<Group[]> => {
  const { data } = await apiClient.get<Group[]>('/groups');
  return data;
};

export const getGroup = async (id: string | number): Promise<Group> => {
  const { data } = await apiClient.get<Group>(`/groups/${id}`);
  return data;
};

export const createGroup = async (group: CreateGroupPayload): Promise<Group> => {
  const { data } = await apiClient.post<Group>('/groups', group);
  return data;
};

export const joinGroup = async (id: string | number): Promise<void> => {
  await apiClient.post(`/groups/${id}/join`);
};

export const leaveGroup = async (id: string | number): Promise<void> => {
  await apiClient.delete(`/groups/${id}/leave`);
};
