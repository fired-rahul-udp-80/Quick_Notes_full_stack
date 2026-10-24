import apiClient from './api/axios';

/**
 * Authentication API Service functions using Axios
 */
export const authApi = {
  // Student registration
  signup: async (userData) => {
    const response = await apiClient.post('/auth/signup', userData);
    return response.data;
  },

  // Verify registration OTP
  verifySignupOTP: async ({ email, otp }) => {
    const response = await apiClient.post('/auth/verify-signup-otp', { email, otp });
    return response.data;
  },

  // Resend registration OTP
  resendSignupOTP: async ({ email }) => {
    const response = await apiClient.post('/auth/resend-signup-otp', { email });
    return response.data;
  },

  // User login (Sets HTTP-only cookies)
  login: async ({ email, password }) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  // User logout (Clears HTTP-only cookies)
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Get current authenticated user session
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Request forgot password OTP
  forgotPassword: async ({ email }) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Verify forgot password OTP to receive resetToken
  verifyResetOTP: async ({ email, otp }) => {
    const response = await apiClient.post('/auth/verify-reset-otp', { email, otp });
    return response.data;
  },

  // Reset password using resetToken
  resetPassword: async ({ email, resetToken, newPassword }) => {
    const response = await apiClient.post('/auth/reset-password', {
      email,
      resetToken,
      newPassword,
    });
    return response.data;
  },

  // Refresh access token via refresh cookie
  refreshToken: async () => {
    const response = await apiClient.post('/auth/refresh-token');
    return response.data;
  },

  // Update authenticated user profile
  updateProfile: async (data) => {
    const response = await apiClient.put('/auth/profile', data);
    return response.data;
  },

  // Send OTP for in-session password change
  sendChangePasswordOTP: async () => {
    const response = await apiClient.post('/auth/send-change-password-otp');
    return response.data;
  },

  // Verify OTP and change password
  changePassword: async ({ currentPassword, newPassword, otp }) => {
    const response = await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
      otp,
    });
    return response.data;
  },
};

// Also export individual functions for convenience
export const {
  signup,
  verifySignupOTP,
  resendSignupOTP,
  login,
  logout,
  getMe,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  refreshToken,
  updateProfile,
  sendChangePasswordOTP,
  changePassword,
} = authApi;

export default authApi;
