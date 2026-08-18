import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createGroup } from '../../api/groups';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const CreateGroup: React.FC = () => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      const group = await createGroup(data);
      navigate(`/groups/${group.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container mt-8 max-w-2xl">
      <h2 className="mb-6">Create Study Group</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex-col gap-4">
        <Input label="Name" {...register('name', { required: true })} />
        <div className="flex-col gap-1 w-full">
          <label className="text-sm font-medium text-gray-600">Description</label>
          <textarea 
            className="w-full p-3 border rounded-md border-gray-200" 
            rows={4}
            {...register('description', { required: true })} 
          />
        </div>
        
        <Button type="submit" isLoading={isSubmitting} className="mt-4">Create Group</Button>
      </form>
    </div>
  );
};

export default CreateGroup;
