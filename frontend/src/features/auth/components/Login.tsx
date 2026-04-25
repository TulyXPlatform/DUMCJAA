import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../types/schemas';
import { useLogin } from '../api/useAuth';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import './Auth.css';

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to the DUMCJAA Alumni Portal</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input 
                id="email" 
                type="email" 
                className={`form-input ${errors.email ? 'form-input--error' : ''}`} 
                placeholder="name@example.com"
                {...register('email')} 
              />
            </div>
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>

          <div className="form-group">
            <div className="label-row">
              <label className="form-label" htmlFor="password">Password</label>
              <Link to="/forgot-password" size={14} className="forgot-link">Forgot Password?</Link>
            </div>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input 
                id="password" 
                type={showPassword ? 'text' : 'password'} 
                className={`form-input ${errors.password ? 'form-input--error' : ''}`} 
                placeholder="••••••••"
                {...register('password')} 
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary auth-submit"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <><Loader2 size={18} className="spin" /> Signing in...</>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
};
