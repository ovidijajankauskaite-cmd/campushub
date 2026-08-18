import { apiClient } from './client';
import { Event, CreateEventPayload } from '../types';

export const getEvents = async (): Promise<Event[]> => {
  const { data } = await apiClient.get<Event[]>('/events');
  return data;
};

export const getEvent = async (id: string | number): Promise<Event> => {
  const { data } = await apiClient.get<Event>(`/events/${id}`);
  return data;
};

export const createEvent = async (event: CreateEventPayload): Promise<Event> => {
  const { data } = await apiClient.post<Event>('/events', event);
  return data;
};

export const updateEvent = async (id: string | number, event: Partial<CreateEventPayload>): Promise<Event> => {
  const { data } = await apiClient.put<Event>(`/events/${id}`, event);
  return data;
};

export const deleteEvent = async (id: string | number): Promise<void> => {
  await apiClient.delete(`/events/${id}`);
};

export const registerForEvent = async (id: string | number): Promise<void> => {
  await apiClient.post(`/events/${id}/register`);
};

export const unregisterFromEvent = async (id: string | number): Promise<void> => {
  await apiClient.delete(`/events/${id}/register`);
};
