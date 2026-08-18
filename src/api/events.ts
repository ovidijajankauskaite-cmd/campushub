import { apiClient } from './client';
import { Event, User } from '../types';

export const getEvents = async () => {
  const { data } = await apiClient.get<Event[]>('/events');
  return data;
};

export const getEvent = async (id: string | number) => {
  const { data } = await apiClient.get<Event>(`/events/${id}`);
  return data;
};

export const createEvent = async (event: Omit<Event, 'id' | 'organizerId' | 'createdAt'>) => {
  const { data } = await apiClient.post<Event>('/events', event);
  return data;
};

export const updateEvent = async (id: string | number, event: Partial<Event>) => {
  const { data } = await apiClient.put<Event>(`/events/${id}`, event);
  return data;
};

export const deleteEvent = async (id: string | number) => {
  await apiClient.delete(`/events/${id}`);
};

export const getEventRegistrations = async (id: string | number) => {
  const { data } = await apiClient.get<User[]>(`/events/${id}/registrations`);
  return data;
};

export const registerForEvent = async (id: string | number) => {
  await apiClient.post(`/events/${id}/register`);
};

export const unregisterFromEvent = async (id: string | number) => {
  await apiClient.delete(`/events/${id}/register`);
};
