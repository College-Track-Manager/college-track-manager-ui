const isDevelopment = import.meta.env.VITE_ENV === 'development';
const isDebug = import.meta.env.VITE_DEBUG === 'true';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050';

export const axiosConfig = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Debug logging function
export const debug = (...args: any[]) => {
  if (isDebug) {
    console.log(`[${new Date().toISOString()}]`, ...args);
  }
};

// Environment-specific configuration
export const config = {
  isDevelopment,
  isDebug,
  api: {
    baseUrl: API_BASE_URL,
    timeout: 10000,
  },
  features: {
    // Add feature flags here
    enableAnalytics: !isDevelopment,
    enableErrorTracking: !isDevelopment,
  },
}; 