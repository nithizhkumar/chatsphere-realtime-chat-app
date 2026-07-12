import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Normalizes error messages so callers can always read `error.message`
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED' ? 'Request timed out. Please try again.' : null) ||
      (!error.response ? 'Network error. Please check your connection.' : null) ||
      'Something went wrong. Please try again.';

    return Promise.reject({ ...error, message });
  }
);

export default axiosClient;
