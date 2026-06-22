'use client';

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// 请求拦截器：自动添加 token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 响应拦截器：处理 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; nickname: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// BaZi API
export const baziAPI = {
  calculate: () => api.post('/bazi/calculate'),
  getResult: () => api.get('/bazi/result'),
};

// MBTI API
export const mbtiAPI = {
  getQuestions: () => api.get('/mbti/questions'),
  submit: (answers: any[]) => api.post('/mbti/submit', { answers }),
  getResult: () => api.get('/mbti/result'),
};

// Holland API
export const hollandAPI = {
  getQuestions: () => api.get('/holland/questions'),
  submit: (answers: any[]) => api.post('/holland/submit', { answers }),
  getResult: () => api.get('/holland/result'),
};

// TianZhi API
export const tianzhiAPI = {
  getQuestions: () => api.get('/tianzhi/questions'),
  submit: (answers: any[]) => api.post('/tianzhi/submit', { answers }),
  getResult: () => api.get('/tianzhi/result'),
};

// Report API
export const reportAPI = {
  generate: () => api.post('/reports/generate'),
  list: () => api.get('/reports'),
  get: (id: number) => api.get(`/reports/${id}`),
  share: (id: number) => api.post(`/reports/${id}/share`),
};
