import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, DEFAULT_REQUEST_TIMEOUT } from '../config/constants';
import { Campaign, Company, PipelineProgressEvent } from '../types';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach authentication or request ID headers if required
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor with Global Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Request Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Typed API Functions Scaffold
export const campaignApi = {
  create: async (data: Partial<Campaign>): Promise<Campaign> => {
    const response = await apiClient.post<Campaign>('/campaigns', data);
    return response.data;
  },
  list: async (): Promise<Campaign[]> => {
    const response = await apiClient.get<Campaign[]>('/campaigns');
    return response.data;
  },
  getById: async (id: string): Promise<Campaign> => {
    const response = await apiClient.get<Campaign>(`/campaigns/${id}`);
    return response.data;
  },
};

export const pipelineApi = {
  run: async (campaignId: string, companyLimit: number = 3) => {
    const response = await apiClient.post('/pipeline/run', {
      campaign_id: campaignId,
      company_limit: companyLimit,
    });
    return response.data;
  },
  createEventSource: (jobId: string, onMessage: (event: PipelineProgressEvent) => void): EventSource => {
    const eventSource = new EventSource(`${API_BASE_URL}/pipeline/stream/${jobId}`);
    eventSource.onmessage = (e) => {
      try {
        const data: PipelineProgressEvent = JSON.parse(e.data);
        onMessage(data);
      } catch (err) {
        console.error('Failed to parse SSE payload:', err);
      }
    };
    return eventSource;
  },
};
