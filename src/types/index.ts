export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'admin';
  studentId: string;
  createdAt: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  organizerId: number;
  createdAt: string;
}

export interface Group {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  createdAt: string;
}

export interface DashboardData {
  upcomingEvents: Event[];
  myGroups: Group[];
}

export interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  totalGroups: number;
  totalRegistrations: number;
}
