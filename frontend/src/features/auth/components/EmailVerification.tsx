import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Loader2, ShieldCheck } from 'lucide-react';
import { getHttpErrorMessage } from '../../../lib/httpError';
import { apiClient } from '../../../api/axios';
import { useAuthStore } from '../hooks/useAuth';

interface VerifyResponse {
  data: {
    userId: string;
    email: string;
    fullName: string;
    roles: string[];
    permissions: string[];
    token: string;
    expiresAt: string;
  };
}

export const EmailVerification: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes

  useEffect(() => {
    // Get email from navigation state or query string
    const stateEmail = location.state?.email;
    const queryEmail = new URLSearchParams(location.search).get('email');
    const resolved = stateEmail || queryEmail || '';
    setEmail(resolved);
  }, [location]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email.');
      return;
    }
    if (code.length !== 6) {
      toast.error('Please enter a 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post<VerifyResponse>('/auth/verify-otp', { email, otp: code });
      const authData = response.data?.data;

      if (authData?.token) {
        setAuth(
          {
            id: authData.userId,
            email: authData.email,
            fullName: authData.fullName,
            roles: authData.roles,
            permissions: authData.permissions,
          },
          authData.token
        );
        localStorage.setItem('token', authData.token);
        localStorage.setItem('role', authData.roles[0] ?? 'Editor');
      }

      toast.success('Email verified successfully.');
      const roles = authData?.roles ?? [];
      if (roles.includes('Admin') || roles.includes('SuperAdmin')) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      toast.error(getHttpErrorMessage(err, 'Verification failed.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await apiClient.post('/auth/request-email-verification-otp', { email });
      toast.success('New code sent to your email.');
      setTimer(300);
    } catch (err: unknown) {
      toast.error(getHttpErrorMessage(err, 'Failed to resend code.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-neutral-200/50 p-10 border border-neutral-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">Verify Your Email</h2>
          <p className="mt-2 text-neutral-500">
            Enter your email and the 6-digit verification code.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-center text-base py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center text-3xl tracking-[0.5em] font-mono py-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              placeholder="000000"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Verify Email'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-500">
            Didn't receive the code?{' '}
            {timer > 0 ? (
              <span className="text-brand-600 font-bold">
                Wait {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
              </span>
            ) : (
                <button
                  onClick={handleResend}
                  disabled={loading}
                  className="text-brand-600 hover:text-brand-700 font-bold underline decoration-brand-200 underline-offset-4"
                >
                Resend Code
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
