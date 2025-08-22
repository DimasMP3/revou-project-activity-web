import React from 'react';
import { animationClasses } from './animations';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No activities yet',
  description = 'Start tracking your first activity to see it here.',
  actionLabel = 'Start Activity',
  onAction,
  icon
}) => {
  const defaultIcon = (
    <svg 
      className="w-16 h-16 text-gray-600 mx-auto" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1.5} 
        d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
      />
    </svg>
  );

  return (
    <div className={`text-center py-16 px-6 ${animationClasses.fadeIn}`}>
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          {icon || defaultIcon}
        </div>
        
        <h3 className="text-2xl font-semibold text-white mb-2">
          {title}
        </h3>
        
        <p className="text-gray-400 mb-8 leading-relaxed">
          {description}
        </p>
        
        {onAction && (
          <button
            onClick={onAction}
            className={`
              bg-gradient-to-r from-indigo-600 to-purple-600 
              text-white px-8 py-3 rounded-xl font-medium
              shadow-lg shadow-indigo-500/25
              ${animationClasses.buttonHover}
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900
            `}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export const EmptySearchState: React.FC = () => {
  const searchIcon = (
    <svg 
      className="w-16 h-16 text-gray-600 mx-auto" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1.5} 
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
      />
    </svg>
  );

  return (
    <EmptyState
      title="No results found"
      description="Try adjusting your search terms or filters to find what you're looking for."
      icon={searchIcon}
    />
  );
};