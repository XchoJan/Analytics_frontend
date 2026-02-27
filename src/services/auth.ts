import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export interface User {
  id: number;
  username: string;
  role: 'user' | 'admin';
  premium: boolean;
  premiumUntil: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Сохраняем токен в localStorage
export function saveToken(token: string) {
  localStorage.setItem('token', token);
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Получаем токен из localStorage
export function getToken(): string | null {
  return localStorage.getItem('token');
}

// Удаляем токен
export function removeToken() {
  localStorage.removeItem('token');
  delete apiClient.defaults.headers.common['Authorization'];
}

// Инициализируем токен при загрузке
const token = getToken();
if (token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export async function register(username: string, password: string, acceptPrivacyPolicy: boolean): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/register', {
    username,
    password,
    acceptPrivacyPolicy,
  });
  
  if (response.data.token) {
    saveToken(response.data.token);
  }
  
  return response.data;
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', {
    username,
    password,
  });
  
  if (response.data.token) {
    saveToken(response.data.token);
  }
  
  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<{ user: User }>('/auth/me');
  return response.data.user;
}

export function logout() {
  removeToken();
}

