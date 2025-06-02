import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import apiClient from './api';
import type { LoginData, SignupData } from './type';

export interface User {
  id: string;
  name: string;
  email: string;
  userRole: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  signUp: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('authToken')
  );
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLogined = async () => {
      if (token) {
        try {
          const response = await apiClient.get<User>('/api/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user info', error);
          setToken(null);
          localStorage.removeItem('authToken');
        }
      }
      setIsLoading(false);
    };

    checkLogined();
  }, [token]);

  const signUp = async (data: SignupData) => {
    const response = await apiClient.post('/api/auth/user', {
      authType: 'APPLICANT',
      info: {
        type: 'APPLICANT',
        name: data.name,
        email: data.email,
        password: data.password,
        successCode: 'success',
      },
    });

    const { token: newToken } = response.data;
    setToken(newToken);
    localStorage.setItem('authToken', newToken);

    const userResponse = await apiClient.get<User>('/api/auth/me');
    setUser(userResponse.data);
  };

  const login = async (data: LoginData) => {
    const response = await apiClient.post('/api/auth/user/session', {
      email: data.email,
      password: data.password,
    });
    const { token: newToken } = response.data;
    setToken(newToken);
    localStorage.setItem('authToken', newToken);

    const userResponse = await apiClient.get<User>('/api/auth/me');
    setUser(userResponse.data);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, isLoading, signUp, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
