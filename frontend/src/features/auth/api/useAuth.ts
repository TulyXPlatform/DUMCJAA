import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../api/axios';
import type { LoginFormData, RegisterFormData } from '../types/schemas';
import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';

interface AuthResponse {
  success: boolean;
  message: string;
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

interface ApiErrorResponse {
  message?: string;
}

const extractEmailFromRequest = (rawData: unknown): string => {
  if (typeof rawData !== 'string') return '';
  try {
    const parsed = JSON.parse(rawData) as { email?: string };
    return parsed.email ?? '';
  } catch {
    return '';
  }
};

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await apiClient.post<AuthResponse>('/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      // Store JWT and Role securely in localStorage
      localStorage.setItem('token', data.data.token);
      const primaryRole = data.data.roles[0] ?? 'Editor';
      localStorage.setItem('role', primaryRole);
      
      toast.success('Logged in successfully!');
      
      // Redirect based on role
      if (data.data.roles.includes('Admin') || data.data.roles.includes('SuperAdmin')) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message = error.response?.data?.message || 'Invalid email or password';
      if (message.toLowerCase().includes('email not verified')) {
        const email = extractEmailFromRequest(error.config?.data);
        navigate(`/verify-email?email=${encodeURIComponent(email || '')}`);
      }
      toast.error(message);
    }
  });
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      // Omit confirmPassword before sending to backend
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      };
      const response = await apiClient.post<AuthResponse>('/auth/register', payload);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('role', data.data.roles[0] ?? 'Editor');
      }
      toast.success('Registration successful! Please verify your email.');
      navigate(`/verify-email?email=${encodeURIComponent(data.data.email)}`);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(error.response?.data?.message || 'Registration failed. Please check your inputs.');
    }
  });
};
