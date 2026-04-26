import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import axios from 'axios';
import { getHttpErrorMessage } from '../../../lib/httpError';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const PasswordResetFlow = () => {
  const [step, setStep] = useState<'request' | 'verify' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/request-password-change-otp`, { email });
      toast.success('Verification code sent to your email.');
      setStep('verify');
      setTimer(300); // 5 minutes
    } catch (err: unknown) {
      toast.error(getHttpErrorMessage(err, 'Failed to send code.'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/verify-otp`, { email, code });
      toast.success('Code verified successfully.');
      setStep('reset');
    } catch (err: unknown) {
      toast.error(getHttpErrorMessage(err, 'Invalid or expired code.'));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/change-password`, { email, code, newPassword });
      toast.success('Password changed successfully. Please login.');
      navigate('/login');
    } catch (err: unknown) {
      toast.error(getHttpErrorMessage(err, 'Failed to change password.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-neutral-200/50 p-8 border border-neutral-100">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center">
            {step === 'request' && <Mail className="w-8 h-8" />}
            {step === 'verify' && <ShieldCheck className="w-8 h-8" />}
            {step === 'reset' && <ArrowRight className="w-8 h-8" />}
          </div>
        </div>

        {step === 'request' && (
          <form onSubmit={handleRequestOTP} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-900">Forgot Password?</h2>
              <p className="mt-2 text-neutral-500">Enter your email and we'll send you a 6-digit verification code.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Code'}
            </button>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-900">Verify Code</h2>
              <p className="mt-2 text-neutral-500">We sent a code to <span className="font-medium text-neutral-900">{email}</span></p>
            </div>
            <div>
              <div className="flex justify-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  required
                  className="w-full text-center text-2xl tracking-[1em] font-mono px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-neutral-500">
                  Code expires in: <span className="font-medium text-brand-600">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                </p>
                <button 
                  type="button"
                  onClick={handleRequestOTP}
                  disabled={timer > 0}
                  className="mt-2 text-brand-600 hover:text-brand-700 text-sm font-medium disabled:text-neutral-400"
                >
                  Resend Code
                </button>
              </div>
            </div>
            <button
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Continue'}
            </button>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-900">Set New Password</h2>
              <p className="mt-2 text-neutral-500">Choose a strong password you haven't used before.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">New Password</label>
              <input
                type="password"
                required
                minLength={8}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
