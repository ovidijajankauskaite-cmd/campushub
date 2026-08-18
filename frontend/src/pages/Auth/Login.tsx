import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { login } from '../../api/auth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import styles from './Auth.module.css';

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm();
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      const response = await login(data);
      setAuth(response.user, response.token);
      navigate(response.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (e: any) {
      setError('root', { message: 'Invalid email or password' });
    }
  };

  return (
    <div className={`container ${styles.authContainer}`}>
      <Card className={styles.authCard}>
        <h2 className="text-center">Welcome Back</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex-col gap-4 mt-4">
          <Input 
            label="Email" 
            type="email" 
            {...register('email', { required: 'Email is required' })} 
            error={errors.email?.message as string} 
          />
          <Input 
            label="Password" 
            type="password" 
            {...register('password', { required: 'Password is required' })} 
            error={errors.password?.message as string} 
          />
          {errors.root && <p className="text-error text-sm">{errors.root.message as string}</p>}
          <Button type="submit" isLoading={isSubmitting} className="w-full">Log In</Button>
        </form>
        <p className="text-center mt-4 text-sm">
          Don't have an account? <Link to="/register" className="text-primary">Register</Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
