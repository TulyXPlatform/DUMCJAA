import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '../types/schemas';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useRegister } from '../api/useAuth';

export const Register: React.FC = () => {
  const registerMutation = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">First Name</label>
              <input
                {...register('firstName')}
                className={`w-full px-4 py-2 bg-neutral-50 border ${errors.firstName ? 'border-danger' : 'border-neutral-200'} rounded-lg focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all`}
                placeholder="John"
              />
              {errors.firstName && <p className="mt-1 text-xs text-danger font-medium">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">Last Name</label>
              <input
                {...register('lastName')}
                className={`w-full px-4 py-2 bg-neutral-50 border ${errors.lastName ? 'border-danger' : 'border-neutral-200'} rounded-lg focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all`}
                placeholder="Doe"
              />
              {errors.lastName && <p className="mt-1 text-xs text-danger font-medium">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">Username</label>
            <input
              {...register('username')}
              className={`w-full px-4 py-2 bg-neutral-50 border ${errors.username ? 'border-danger' : 'border-neutral-200'} rounded-lg focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all`}
              placeholder="johndoe88"
            />
            {errors.username && <p className="mt-1 text-xs text-danger font-medium">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                {...register('email')}
                type="email"
                className={`w-full pl-10 pr-4 py-2 bg-neutral-50 border ${errors.email ? 'border-danger' : 'border-neutral-200'} rounded-lg focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all`}
                placeholder="john@example.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-danger font-medium">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">Student ID</label>
              <input
                {...register('studentId')}
                className={`w-full px-4 py-2 bg-neutral-50 border ${errors.studentId ? 'border-danger' : 'border-neutral-200'} rounded-lg focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all`}
                placeholder="MCJ-2021-001"
              />
              {errors.studentId && <p className="mt-1 text-xs text-danger font-medium">{errors.studentId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">Phone Number</label>
              <input
                {...register('phone')}
                className={`w-full px-4 py-2 bg-neutral-50 border ${errors.phone ? 'border-danger' : 'border-neutral-200'} rounded-lg focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all`}
                placeholder="01700000000"
              />
              {errors.phone && <p className="mt-1 text-xs text-danger font-medium">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  {...register('password')}
                  type="password"
                  className={`w-full pl-10 pr-4 py-2 bg-neutral-50 border ${errors.password ? 'border-danger' : 'border-neutral-200'} rounded-lg focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-danger font-medium">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">Confirm</label>
              <input
                {...register('confirmPassword')}
                type="password"
                className={`w-full px-4 py-2 bg-neutral-50 border ${errors.confirmPassword ? 'border-danger' : 'border-neutral-200'} rounded-lg focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-danger font-medium">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button
            disabled={registerMutation.isPending}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-brand-200 transition-all flex items-center justify-center gap-2 group mt-4"
          >
            {registerMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Register Now
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
