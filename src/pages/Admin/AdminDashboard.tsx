import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdminStats, getAdminUsers, getAdminEvents, deleteAdminEvent } from '../../api/admin';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const AdminDashboard: React.FC = () => {
  const { data: stats } = useQuery({ queryKey: ['adminStats'], queryFn: getAdminStats });
  const { data: users } = useQuery({ queryKey: ['adminUsers'], queryFn: getAdminUsers });
  const { data: events, refetch } = useQuery({ queryKey: ['adminEvents'], queryFn: getAdminEvents });

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteAdminEvent(id);
      refetch();
    }
  };

  return (
    <div className="container mt-8">
      <h2>Admin Dashboard</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Card className="p-6 text-center">
          <h3>{stats?.totalUsers || 0}</h3>
          <p className="text-sm m-0">Total Users</p>
        </Card>
        <Card className="p-6 text-center">
          <h3>{stats?.totalEvents || 0}</h3>
          <p className="text-sm m-0">Total Events</p>
        </Card>
        <Card className="p-6 text-center">
          <h3>{stats?.totalGroups || 0}</h3>
          <p className="text-sm m-0">Total Groups</p>
        </Card>
        <Card className="p-6 text-center">
          <h3>{stats?.totalRegistrations || 0}</h3>
          <p className="text-sm m-0">Total Registrations</p>
        </Card>
      </div>

      <div className="mt-12">
        <h3>Events Management</h3>
        <div className="mt-4" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <th className="p-2">ID</th>
                <th className="p-2">Title</th>
                <th className="p-2">Date</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events?.map(event => (
                <tr key={event.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td className="p-2">{event.id}</td>
                  <td className="p-2">{event.title}</td>
                  <td className="p-2">{new Date(event.date).toLocaleDateString()}</td>
                  <td className="p-2">
                    <Button variant="danger" size="sm" onClick={() => handleDelete(event.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
