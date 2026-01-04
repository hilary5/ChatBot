import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const api = axios.create({
   baseURL: API_URL,
   headers: { 'Content-Type': 'application/json' },
});

export const postChat = <T = any>(payload: unknown) =>
   api.post<T>('/api/chat', payload);
