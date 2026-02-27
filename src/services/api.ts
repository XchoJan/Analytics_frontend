import axios from 'axios';
import {Prediction} from '../types';
import { getToken } from './auth';

const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 минуты для парсинга
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

export async function getSinglePrediction(matches?: Match[]): Promise<Prediction> {
  const response = await apiClient.post<Prediction>('/single', { matches });
  return response.data;
}

export async function getExpressPrediction(matches?: Match[]): Promise<Prediction> {
  const response = await apiClient.post<Prediction>('/express', { matches });
  return response.data;
}

export async function getExpress5Prediction(matches?: Match[]): Promise<Prediction> {
  const response = await apiClient.post<Prediction>('/express5', { matches });
  return response.data;
}

export interface Match {
  id?: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time?: string;
  league?: string;
  odds?: {
    home: number;
    draw: number;
    away: number;
  };
}

export interface MatchesResponse {
  matches: Match[];
}

export async function getMatches(): Promise<Match[]> {
  const response = await apiClient.get<MatchesResponse>('/matches');
  return response.data.matches;
}

export async function getMatchesWithOdds(): Promise<Match[]> {
  const response = await apiClient.get<MatchesResponse>('/matches-with-odds');
  return response.data.matches;
}

export interface MatchAnalysis {
  match: string;
  prediction: string;
  riskPercent: number;
  odds: number;
}

export async function analyzeMatch(match: string, league?: string, date?: string): Promise<MatchAnalysis> {
  const response = await apiClient.post<MatchAnalysis>('/analyze', { match, league, date });
  return response.data;
}

export interface Stats {
  activeUsers: number;
  successfulPredictions: number;
  failedPredictions: number;
  lastUpdateDate: string;
}

export async function getStats(): Promise<Stats> {
  const response = await apiClient.get<Stats>('/stats');
  return response.data;
}

export interface CreatePaymentResponse {
  paymentUrl: string;
  orderId: string;
  amount: number;
  currency: string;
}

export async function createPayment(plan: 'week' | 'month' | 'threeMonths'): Promise<CreatePaymentResponse> {
  const response = await apiClient.post<CreatePaymentResponse>('/payments/create', { plan });
  return response.data;
}

export interface PaymentStatus {
  orderId: string;
  status: string;
  plan: string;
  amount: number;
}

export async function getPaymentStatus(orderId: string): Promise<PaymentStatus> {
  const response = await apiClient.get<PaymentStatus>(`/payments/status/${orderId}`);
  return response.data;
}
