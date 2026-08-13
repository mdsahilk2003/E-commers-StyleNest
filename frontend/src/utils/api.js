import axios from 'axios';

const getBaseURL = () => {
    if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
        return 'https://backend-five-khaki-22.vercel.app/api';
    }
    return '/api';
};

const api = axios.create({
    baseURL: getBaseURL(),
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const isAuthRequest = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
            if (!isAuthRequest) {
                // Unauthorized - clear user data and redirect to login
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
