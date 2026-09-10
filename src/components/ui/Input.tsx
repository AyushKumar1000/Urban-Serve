import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col w-full ${className}`}>
        {label && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
        <input
          ref={ref}
          className={`h-11 rounded-lg border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500'} px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow`}
          {...props}
        />
        {error && <span className="mt-1 text-sm text-red-500">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
