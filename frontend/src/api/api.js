import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock data for development
const mockData = {
  users: [
    { id: 1, name: 'John Smith', email: 'john@example.com', role: 'patient', status: 'active', phone: '+1234567890' },
    { id: 2, name: 'Dr. Sarah Wilson', email: 'sarah@hospital.com', role: 'doctor', status: 'active', phone: '+1234567891' },
  ],
  stats: {
    totalPatients: 2847,
    totalDoctors: 42,
    todayAppointments: 156,
    lowStockItems: 23,
    monthlyRevenue: 125430,
    satisfactionRate: 4.7
  }
};

// Mock API methods for development
api.get = async function(url, config) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (url.includes('/users')) {
    return { data: mockData.users };
  }
  
  if (url.includes('/dashboard')) {
    return { data: mockData.stats };
  }
  
  return { data: [] };
};

api.post = async function(url, data, config) {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { data: { success: true, message: 'Operation successful' } };
};

export default api;