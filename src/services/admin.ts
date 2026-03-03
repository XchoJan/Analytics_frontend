import axios from 'axios';
import { getToken } from './auth';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен в заголовки каждого запроса
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getVbetUrls(): Promise<string[]> {
  const response = await apiClient.get<{ urls: string[] }>('/admin/urls');
  return response.data.urls;
}

export async function setVbetUrls(urls: string[]): Promise<string[]> {
  const response = await apiClient.post<{ success: boolean; urls: string[] }>('/admin/urls', { urls });
  return response.data.urls;
}

export async function generatePredictions(): Promise<void> {
  await apiClient.post('/admin/generate-predictions');
}

export interface PredictionCounts {
  single: number;
  express: number;
  express5: number;
}

export async function getPredictionCounts(): Promise<PredictionCounts> {
  const response = await apiClient.get<PredictionCounts>('/admin/predictions-status');
  return response.data;
}

export interface AdminStatsData {
  totalUsers: number;
  premiumCount: number;
  totalLaunches: number;
  successfulPayments: number;
  newUsersLast7Days: number;
  newPaymentsLast7Days: number;
}

export async function getAdminStats(): Promise<AdminStatsData> {
  const response = await apiClient.get<AdminStatsData>('/admin/stats');
  return response.data;
}

