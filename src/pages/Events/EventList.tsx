import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEvents } from '../../api/events';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const EventList: React.FC = () => {
  const [search, setSearch] = useState('');
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });

  const filteredEvents = events?.filter(e => e.title.toLowerCase().includes(search.toLowerCase())) || [];

  if (error) {
    return <div className="container mt-8 text-center text-error">Failed to load events</div>;
  }

  return (
    <div className="container mt-8">
      <div className="flex justify-between items-center mb-8">
        <h2>Upcoming Events</h2>
        <Link to="/events/create" className="text-primary font-medium">+ Create Event</Link>
      </div>

      <Input 
        placeholder="Search events..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8 max-w-md"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-[200px]" />)}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12">No events found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <Card key={event.id} hoverable className="h-full flex flex-col">
              <Link to={`/events/${event.id}`} className="block h-full">
                <div className="h-40 bg-gray-200 overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1523580494112-071d16940d14?auto=format&fit=crop&w=800&q=80" alt={event.title} className="w-full h-full object-cover" />
                  <Badge variant="primary" className="absolute top-2 right-2">
                    {event.capacity} Spots
                  </Badge>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="m-0 text-lg">{event.title}</h3>
                  <p className="text-sm text-gray-500 mt-2 mb-4">{format(new Date(event.date), 'PPP')} • {event.location}</p>
                  <p className="text-sm line-clamp-2 mt-auto">{event.description}</p>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
