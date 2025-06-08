/**
 * ErrorMessage component
 * Displays a styled error message.
 * Andrew Koves
 * 20126313
 * SPEED Group 3
 */
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4" role="alert">
    <span className="font-semibold">Error: </span>{message}
  </div>
);

export default ErrorMessage;