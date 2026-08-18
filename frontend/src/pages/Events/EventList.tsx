import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getEvents, registerForEvent, unregisterFromEvent } from '../../api/events';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { useAuthStore } from '../../store/authStore';
import styles from './EventList.module.css';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523580494112-071d16940d14?auto=format&fit=crop&w=800&q=80';

const EventList: React.FC = () => {
  const [search, setSearch] = useState('');
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });

  const registerMutation = useMutation({
    mutationFn: (id: number) => registerForEvent(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });

  const unregisterMutation = useMutation({
    mutationFn: (id: number) => unregisterFromEvent(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });

  const filteredEvents = events?.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase())
  ) || [];

  if (error) {
    return (
      <div className={styles.errorState}>
        <p>⚠️ Failed to load events. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Upcoming Events</h1>
          <p className={styles.subtitle}>Discover what's happening on campus</p>
        </div>
        {user && (
          <Link to="/events/create">
            <Button variant="primary">+ Create Event</Button>
          </Link>
        )}
      </div>

      <div className={styles.searchBar}>
        <Input
          placeholder="Search events by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className={styles.grid}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className={styles.skeletonCard} />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyIcon}>📅</p>
          <h3>No events found</h3>
          <p>Try a different search term or create the first event!</p>
          {user && (
            <Link to="/events/create">
              <Button variant="primary" size="lg">Create an Event</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredEvents.map(event => {
            const spotsLeft = event.capacity - (event.registration_count ?? 0);
            const isFull = spotsLeft <= 0;
            const isPending = registerMutation.isPending || unregisterMutation.isPending;

            return (
              <Card key={event.id} hoverable className={styles.eventCard}>
                <Link to={`/events/${event.id}`} className={styles.imageLink}>
                  <div className={styles.imageWrapper}>
                    <img
                      src={event.image_url || FALLBACK_IMAGE}
                      alt={event.title}
                      className={styles.image}
                      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                    />
                    <div className={styles.imageBadges}>
                      {isFull ? (
                        <Badge variant="danger">Full</Badge>
                      ) : (
                        <Badge variant="success">{spotsLeft} spots left</Badge>
                      )}
                    </div>
                  </div>
                </Link>
                <div className={styles.cardBody}>
                  <Link to={`/events/${event.id}`} className={styles.titleLink}>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                  </Link>
                  <div className={styles.meta}>
                    <span>📅 {format(new Date(event.event_date), 'MMM d, yyyy • h:mm a')}</span>
                    <span>📍 {event.location}</span>
                  </div>
                  <p className={styles.description}>{event.description}</p>
                  {user && (
                    <div className={styles.cardActions}>
                      {event.is_registered ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => unregisterMutation.mutate(event.id)}
                          disabled={isPending}
                        >
                          ✓ Registered — Cancel
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => registerMutation.mutate(event.id)}
                          disabled={isFull || isPending}
                        >
                          {isFull ? 'Event Full' : 'Register'}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventList;
