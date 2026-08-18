import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEvent, registerForEvent, unregisterFromEvent } from '../../api/events';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { format } from 'date-fns';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEvent(id!),
    enabled: !!id,
  });

  const registerMutation = useMutation({
    mutationFn: () => registerForEvent(id!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['event', id] }),
  });

  if (isLoading) return <div className="container mt-8"><Skeleton className="h-[400px]" /></div>;
  if (error || !event) return <div className="container mt-8 text-center text-error">Event not found</div>;

  return (
    <div className="container mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <img 
            src="https://images.unsplash.com/photo-1523580494112-071d16940d14?auto=format&fit=crop&w=1200&q=80" 
            alt={event.title} 
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
          <h1 className="mb-4">{event.title}</h1>
          <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
        </div>
        
        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="mb-4">Details</h3>
            <p className="mb-2"><strong>Date:</strong> {format(new Date(event.date), 'PPP p')}</p>
            <p className="mb-2"><strong>Location:</strong> {event.location}</p>
            <p className="mb-6"><strong>Capacity:</strong> {event.capacity}</p>

            {user ? (
              <Button 
                className="w-full" 
                onClick={() => registerMutation.mutate()}
                isLoading={registerMutation.isPending}
              >
                Register for Event
              </Button>
            ) : (
              <Button className="w-full" onClick={() => navigate('/login')}>
                Log in to Register
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
