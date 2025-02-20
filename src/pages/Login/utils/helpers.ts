import { ERROR_MESSAGES } from './constants';

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return ERROR_MESSAGES.REQUIRED_EMAIL;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return ERROR_MESSAGES.INVALID_EMAIL;
  }

  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return ERROR_MESSAGES.REQUIRED_PASSWORD;
  }

  if (password.length < 6) {
    return ERROR_MESSAGES.MIN_PASSWORD_LENGTH;
  }

  return null;
};

export const formatErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message === 'Network Error') {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  return ERROR_MESSAGES.SERVER_ERROR;
}; 