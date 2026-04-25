import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '../types/schemas';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/register`, data);
      toast.success('Account created! Please verify your email.');
      // Pass the email to the verification page via state
      navigate('/verify-email', { state: { email: data.email } });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl shadow-neutral-200/50 p-10 border border-neutral-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900">Join DUMCJAA</h2>
          <p className="mt-2 text-neutral-500">Connect with your fellow alumni today.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">First Name</label>
              <div className="relative">
                <input
                  {...register('firstName')}
                  className={`w-full pl-4 pr-4 py-3 bg-neutral-50 border ${errors.firstName ? 'border-danger' : 'border-neutral-200'} rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all`}
                  placeholder="John"
                />
              </div>
              {errors.firstName && <p className="mt-1 text-xs text-danger font-medium">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">Last Name</label>
              <input
                {...register('lastName')}
                className={`w-full pl-4 pr-4 py-3 bg-neutral-50 border ${errors.lastName ? 'border-danger' : 'border-neutral-200'} rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all`}
                placeholder="Doe"
              />
              {errors.lastName && <p className="mt-1 text-xs text-danger font-medium">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                {...register('email')}
                type="email"
                className={`w-full pl-12 pr-4 py-3 bg-neutral-50 border ${errors.email ? 'border-danger' : 'border-neutral-200'} rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all`}
                placeholder="john@example.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-danger font-medium">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  {...register('password')}
                  type="password"
                  className={`w-full pl-12 pr-4 py-3 bg-neutral-50 border ${errors.password ? 'border-danger' : 'border-neutral-200'} rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-danger font-medium">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">Confirm Password</label>
              <input
                {...register('confirmPassword')}
                type="password"
                className={`w-full pl-4 pr-4 py-3 bg-neutral-50 border ${errors.confirmPassword ? 'border-danger' : 'border-neutral-200'} rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-danger font-medium">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-200 transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-neutral-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 hover:text-brand-700 font-bold underline decoration-brand-200 underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
