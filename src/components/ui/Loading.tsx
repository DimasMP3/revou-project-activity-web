import React from 'react';
import { animationClasses } from './animations';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${animationClasses.spin} ${className}`}>
      <div className="w-full h-full border-2 border-indigo-600 border-t-transparent rounded-full"></div>
    </div>
  );
};

interface LoadingCardProps {
  count?: number;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className={`bg-gray-800 p-6 rounded-xl shadow-lg ${animationClasses.pulse}`}
        >
          <div className="space-y-4">
            <div className="h-6 bg-gray-700 rounded-lg w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded-lg w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded-lg w-2/3"></div>
            <div className="flex gap-2 mt-4">
              <div className="h-8 w-16 bg-gray-700 rounded-md"></div>
              <div className="h-8 w-16 bg-gray-700 rounded-md"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading activities...' 
}) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" className="mx-auto" />
        <p className="text-gray-400 text-lg">{message}</p>
      </div>
    </div>
  );
};