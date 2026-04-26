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
    token: string;
    user: {
      id: string;
      email: string;
      fullName: string;
      role: string;
    }
  }
}

interface ApiErrorResponse {
  message?: string;
}

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
      localStorage.setItem('role', data.data.user.role);
      
      toast.success('Logged in successfully!');
      
      // Redirect based on role
      if (data.data.user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/alumni');
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(error.response?.data?.message || 'Invalid email or password');
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
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('role', data.data.user.role);
      toast.success('Registration successful!');
      navigate('/alumni');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(error.response?.data?.message || 'Registration failed. Please check your inputs.');
    }
  });
};
