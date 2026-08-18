import { apiClient } from './client';
import { DashboardData } from '../types';

export const getDashboard = async () => {
  const { data } = await apiClient.get<DashboardData>('/dashboard');
  return data;
};
