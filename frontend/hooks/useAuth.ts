import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import { User } from '@/types/user';

interface AuthResponse {
  token: string;
  user: User;
}

interface LoginInput {
  email: string;
  password: string;
}

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (payload: LoginInput) => {
      const response = await api.post<AuthResponse>('/auth/login', payload);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth({ token: data.token, refreshToken: null, user: data.user });
    }
  });
};

export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  return () => clearAuth();
};
