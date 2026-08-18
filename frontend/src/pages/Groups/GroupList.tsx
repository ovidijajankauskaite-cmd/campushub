import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGroups } from '../../api/groups';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { Link } from 'react-router-dom';

const GroupList: React.FC = () => {
  const [search, setSearch] = useState('');
  const { data: groups, isLoading, error } = useQuery({
    queryKey: ['groups'],
    queryFn: getGroups,
  });

  const filteredGroups = groups?.filter(g => g.name.toLowerCase().includes(search.toLowerCase())) || [];

  if (error) {
    return <div className="container mt-8 text-center text-error">Failed to load groups</div>;
  }

  return (
    <div className="container mt-8">
      <div className="flex justify-between items-center mb-8">
        <h2>Study Groups</h2>
        <Link to="/groups/create" className="text-primary font-medium">+ Create Group</Link>
      </div>

      <Input 
        placeholder="Search groups..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8 max-w-md"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-[150px]" />)}
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="text-center py-12">No groups found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map(group => (
            <Card key={group.id} hoverable className="p-6">
              <Link to={`/groups/${group.id}`}>
                <h3 className="m-0 text-lg text-primary">{group.name}</h3>
                <p className="text-sm mt-4 text-gray-600 line-clamp-3">{group.description}</p>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupList;
