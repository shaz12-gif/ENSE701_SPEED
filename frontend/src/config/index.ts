/**
 * Application configuration - centralizes all environment variables
 */

// API configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Feature flags
export const DEBUG_MODE = process.env.NEXT_PUBLIC_ENABLE_DEBUG_LOGGING === 'true';

// Authentication settings
export const AUTH_STORAGE_KEY = 'isAuthenticated';
export const USER_ROLE_STORAGE_KEY = 'userRole';
export const USERNAME_STORAGE_KEY = 'username';

// Default pagination
export const DEFAULT_PAGE_SIZE = 10;

// Demo credentials (normally these would not be hardcoded, but for this app it's ok)
export const DEMO_CREDENTIALS = {
  admin: {
    username: 'admin',
    password: 'password123',
    role: 'admin'
  },
  analyst: {
    username: 'analyst',
    password: 'password123',
    role: 'analyst'
  }
};