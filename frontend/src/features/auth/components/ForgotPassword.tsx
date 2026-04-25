import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../types/schemas';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import './Auth.css';

export const ForgotPassword: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Reset link sent to:', data.email);
    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-success-state">
            <div className="success-icon-wrap">
              <CheckCircle size={48} className="text-success" />
            </div>
            <h2 className="auth-title">Check your email</h2>
            <p className="auth-subtitle">
              We've sent a password reset link to your email address. Please follow the instructions to reset your password.
            </p>
            <div className="auth-footer">
              <Link to="/login" className="back-link">
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-wrap">
            <Mail size={24} />
          </div>
          <h2 className="auth-title">Forgot Password?</h2>
          <p className="auth-subtitle">
            Enter the email address associated with your account and we'll send you a link to reset your password.
          </p>
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

          <button 
            type="submit" 
            className="btn btn-primary auth-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <><Loader2 size={18} className="spin" /> Sending Link...</>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login" className="back-link">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};
