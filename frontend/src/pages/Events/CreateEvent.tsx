import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../api/events';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const CreateEvent: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      const event = await createEvent({
        ...data,
        capacity: parseInt(data.capacity, 10),
      });
      navigate(`/events/${event.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container mt-8 max-w-2xl">
      <h2 className="mb-6">Create New Event</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex-col gap-4">
        <Input label="Title" {...register('title', { required: true })} />
        <div className="flex-col gap-1 w-full">
          <label className="text-sm font-medium text-gray-600">Description</label>
          <textarea 
            className="w-full p-3 border rounded-md border-gray-200" 
            rows={5}
            {...register('description', { required: true })} 
          />
        </div>
        <Input type="datetime-local" label="Date and Time" {...register('date', { required: true })} />
        <Input label="Location" {...register('location', { required: true })} />
        <Input type="number" label="Capacity" {...register('capacity', { required: true })} />
        
        <Button type="submit" isLoading={isSubmitting} className="mt-4">Create Event</Button>
      </form>
    </div>
  );
};

export default CreateEvent;
