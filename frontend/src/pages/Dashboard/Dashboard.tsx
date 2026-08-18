import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '../../api/dashboard';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
  });

  if (isLoading) {
    return (
      <div className="container mt-8">
        <Skeleton className="h-full" />
      </div>
    );
  }

  if (error) {
    return <div className="container mt-8 text-center text-error">Failed to load dashboard</div>;
  }

  return (
    <div className="container mt-8">
      <h2 className="mb-8">Welcome back, {user?.name}!</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3>Upcoming Events You're Attending</h3>
          <div className="flex-col gap-4 mt-4">
            {data?.upcomingEvents.length === 0 ? (
              <p>You haven't registered for any events yet.</p>
            ) : (
              data?.upcomingEvents.map(event => (
                <Card key={event.id} className="p-4" hoverable>
                  <Link to={`/events/${event.id}`}>
                    <h4 className="m-0 text-primary">{event.title}</h4>
                    <p className="text-sm mt-2">{format(new Date(event.date), 'PPP p')} • {event.location}</p>
                  </Link>
                </Card>
              ))
            )}
          </div>
        </div>

        <div>
          <h3>Your Study Groups</h3>
          <div className="flex-col gap-4 mt-4">
            {data?.myGroups.length === 0 ? (
              <p>You haven't joined any groups yet.</p>
            ) : (
              data?.myGroups.map(group => (
                <Card key={group.id} className="p-4" hoverable>
                  <Link to={`/groups/${group.id}`}>
                    <h4 className="m-0 text-primary">{group.name}</h4>
                    <p className="text-sm mt-2">{group.description}</p>
                  </Link>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
