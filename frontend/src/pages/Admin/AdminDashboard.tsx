import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getAdminStats, getAdminUsers, getAdminEvents, deleteAdminEvent } from '../../api/admin';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import styles from './AdminDashboard.module.css';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'events'>('users');
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: getAdminStats,
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getAdminUsers,
    enabled: activeTab === 'users',
  });

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['adminEvents'],
    queryFn: getAdminEvents,
    enabled: activeTab === 'events',
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAdminEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      setDeleteTarget(null);
    },
  });

  const statsItems = [
    { label: 'Total Users', value: stats?.totalUsers ?? '—', icon: '👤', color: styles.statBlue },
    { label: 'Total Events', value: stats?.totalEvents ?? '—', icon: '📅', color: styles.statTeal },
    { label: 'Study Groups', value: stats?.totalGroups ?? '—', icon: '👥', color: styles.statPurple },
    { label: 'Registrations', value: stats?.totalRegistrations ?? '—', icon: '✅', color: styles.statGreen },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Admin Dashboard</h1>
        <Badge variant="danger">Admin</Badge>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {statsItems.map(item => (
          <Card key={item.label} className={`${styles.statCard} ${item.color}`}>
            <span className={styles.statIcon}>{item.icon}</span>
            <div className={styles.statValue}>{statsLoading ? '...' : item.value}</div>
            <div className={styles.statLabel}>{item.label}</div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'users' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'events' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
      </div>

      {/* Users Table */}
      {activeTab === 'users' && (
        <Card className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {usersLoading ? (
                  <tr><td colSpan={4} className={styles.loadingCell}>Loading users...</td></tr>
                ) : usersData?.users?.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className={styles.userCell}>
                        <Avatar name={user.full_name} src={user.avatar_url ?? undefined} size="sm" />
                        <span>{user.full_name}</span>
                      </div>
                    </td>
                    <td className={styles.emailCell}>{user.email}</td>
                    <td>
                      <Badge variant={user.role === 'admin' ? 'danger' : 'primary'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className={styles.dateCell}>
                      {format(new Date(user.created_at), 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {usersData && (
            <div className={styles.tableFooter}>
              Showing {usersData.users?.length} of {usersData.total} users
            </div>
          )}
        </Card>
      )}

      {/* Events Table */}
      {activeTab === 'events' && (
        <Card className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Creator</th>
                  <th>Date</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {eventsLoading ? (
                  <tr><td colSpan={5} className={styles.loadingCell}>Loading events...</td></tr>
                ) : events?.map(event => (
                  <tr key={event.id}>
                    <td className={styles.eventTitleCell}>{event.title}</td>
                    <td>{event.creator_name ?? '—'}</td>
                    <td className={styles.dateCell}>
                      {format(new Date(event.event_date), 'MMM d, yyyy')}
                    </td>
                    <td>{event.capacity}</td>
                    <td>
                      {deleteTarget === event.id ? (
                        <div className={styles.confirmActions}>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => deleteMutation.mutate(event.id)}
                            disabled={deleteMutation.isPending}
                          >
                            Confirm Delete
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTarget(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setDeleteTarget(event.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
