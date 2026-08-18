import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGroup, joinGroup } from '../../api/groups';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';

const GroupDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const { data: group, isLoading } = useQuery({
    queryKey: ['group', id],
    queryFn: () => getGroup(id!),
    enabled: !!id,
  });

  const joinMutation = useMutation({
    mutationFn: () => joinGroup(id!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['group', id] }),
  });

  if (isLoading) return <div className="container mt-8">Loading...</div>;
  if (!group) return <div className="container mt-8 text-center text-error">Group not found</div>;

  return (
    <div className="container mt-8 max-w-3xl">
      <h1 className="mb-4">{group.name}</h1>
      <p className="text-gray-700 whitespace-pre-wrap mb-8 text-lg">{group.description}</p>
      
      {user ? (
        <Button onClick={() => joinMutation.mutate()} isLoading={joinMutation.isPending}>
          Join Group
        </Button>
      ) : (
        <Button onClick={() => navigate('/login')}>Log in to Join</Button>
      )}
    </div>
  );
};

export default GroupDetail;
