import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '../types/schemas';
import { useRegister } from '../api/useAuth';
import { Link } from 'react-router-dom';
import './Auth.css';

export const Register: React.FC = () => {
  const registerMutation = useRegister();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="auth-container">
      <div className="auth-card card">
        <div className="auth-header">
          <h2>Create an Account</h2>
          <p>Join the DUMCJAA community</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input 
                id="firstName" 
                className={`input ${errors.firstName ? 'input-error' : ''}`} 
                {...register('firstName')} 
              />
              {errors.firstName && <span className="error-message">{errors.firstName.message}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input 
                id="lastName" 
                className={`input ${errors.lastName ? 'input-error' : ''}`} 
                {...register('lastName')} 
              />
              {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email" 
              type="email" 
              className={`input ${errors.email ? 'input-error' : ''}`} 
              {...register('email')} 
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              className={`input ${errors.password ? 'input-error' : ''}`} 
              {...register('password')} 
            />
            {errors.password && <span className="error-message">{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              id="confirmPassword" 
              type="password" 
              className={`input ${errors.confirmPassword ? 'input-error' : ''}`} 
              {...register('confirmPassword')} 
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary auth-submit"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};
