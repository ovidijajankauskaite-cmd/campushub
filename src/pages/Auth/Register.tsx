import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { register as registerApi } from '../../api/auth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import styles from './Auth.module.css';

const Register: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, setError } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await registerApi({
        name: data.name,
        email: data.email,
        password: data.password,
        studentId: data.studentId
      });
      navigate('/login');
    } catch (e: any) {
      setError('root', { message: 'Registration failed' });
    }
  };

  return (
    <div className={`container ${styles.authContainer}`}>
      <Card className={styles.authCard}>
        <h2 className="text-center">Create an Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex-col gap-4 mt-4">
          <Input 
            label="Full Name" 
            {...register('name', { required: 'Name is required' })} 
            error={errors.name?.message as string} 
          />
          <Input 
            label="Email" 
            type="email" 
            {...register('email', { required: 'Email is required' })} 
            error={errors.email?.message as string} 
          />
          <Input 
            label="Student ID" 
            {...register('studentId', { required: 'Student ID is required' })} 
            error={errors.studentId?.message as string} 
          />
          <Input 
            label="Password" 
            type="password" 
            {...register('password', { required: 'Password is required' })} 
            error={errors.password?.message as string} 
          />
          <Input 
            label="Confirm Password" 
            type="password" 
            {...register('confirmPassword', { 
              validate: (val: string) => {
                if (watch('password') != val) {
                  return "Your passwords do no match";
                }
              }
             })} 
            error={errors.confirmPassword?.message as string} 
          />
          {errors.root && <p className="text-error text-sm">{errors.root.message as string}</p>}
          <Button type="submit" isLoading={isSubmitting} className="w-full">Register</Button>
        </form>
        <p className="text-center mt-4 text-sm">
          Already have an account? <Link to="/login" className="text-primary">Log In</Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;
