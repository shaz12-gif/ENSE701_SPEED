/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException, HttpStatus, Logger } from '@nestjs/common';

/**
 * Standard error response format
 */
export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path?: string;
}

/**
 * Handles and formats API errors with consistent structure
 * @param error The error object
 * @param context The context where error occurred (usually the class/service name)
 * @param path Optional request path where error occurred
 * @returns Formatted HTTP exception
 */
export function handleApiError(
  error: any,
  context: string,
  path?: string,
): HttpException {
  // Create a logger instance
  const logger = new Logger(context);

  // Log the error
  logger.error(`Error in ${context}: ${error.message}`, error.stack);

  // Default status is 500 (Internal Server Error)
  let status = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'An unexpected error occurred';

  // Handle different error types
  if (error instanceof HttpException) {
    return error; // Return existing HTTP exceptions as-is
  }

  if (error.name === 'ValidationError') {
    status = HttpStatus.BAD_REQUEST;
    message = 'Validation failed';
  } else if (error.name === 'MongoServerError' && error.code === 11000) {
    status = HttpStatus.CONFLICT;
    message = 'Duplicate entry';
  } else if (error.name === 'CastError') {
    status = HttpStatus.BAD_REQUEST;
    message = 'Invalid ID format';
  }

  // Create a formatted error response
  const response: ErrorResponse = {
    statusCode: status,
    message: message,
    error: error.message,
    timestamp: new Date().toISOString(),
    path,
  };

  return new HttpException(response, status);
}
