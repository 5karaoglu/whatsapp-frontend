import axios from 'axios';

const api = axios.create({
  // Point to the correct backend server URL
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://whatsapp.mayivo.com/api',
});

// Add a response interceptor to handle auth errors globally
api.interceptors.response.use(
  (response) => response, // Directly return successful responses
  (error) => {
    // Check if the error is a 401 Unauthorized or 403 Forbidden
    if (error.response && [401, 403].includes(error.response.status)) {
      // Don't intercept if the error is for the CREDENTIALS_MISSING case on the login page
      if (error.response.data?.errorCode !== 'CREDENTIALS_MISSING') {
        // Clear token from local storage
        localStorage.removeItem('authToken');
        // Remove the Authorization header from future requests
        delete api.defaults.headers.common['Authorization'];
        // Redirect to login page, replacing the history
        window.location.href = '/login'; 
      }
    }
    // For all other errors, just pass them along
    return Promise.reject(error);
  }
);

export default api; 