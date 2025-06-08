/**
 * SuccessMessage component
 * Displays a styled success message.
 * Andrew Koves
 * 20126313
 * SPEED Group 3
 */
import React from 'react';

interface SuccessMessageProps {
  message: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default SuccessMessage;