import React, { useState } from 'react';
import { animationClasses } from '../ui/animations';
import { ConfirmationModal } from '../ui/Modal';

export type Activity = {
  id: string;
  title: string;
  category: string | null;
  startTime: Date | string;
  endTime: Date | string | null;
  createdAt: Date | string;
  userId: string;
};

interface ActivityCardProps {
  activity: Activity;
  onDelete: (id: string) => void;
  onEdit: (activity: Activity) => void;
  onToggleTimer?: (activity: Activity) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  onDelete, 
  onEdit,
  onToggleTimer 
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update current time every minute for accurate status
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  const startTime = new Date(activity.startTime).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const endTime = activity.endTime 
    ? new Date(activity.endTime).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    : null;

  const startDate = new Date(activity.startTime);
  const endDate = activity.endTime ? new Date(activity.endTime) : null;
  const now = currentTime;
  
  // Determine activity status with time synchronization
  const getActivityStatus = () => {
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    const activityStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    
    // Future activities (scheduled for later)
    if (startDate > now) {
      if (activityStart.getTime() === todayStart.getTime()) {
        return { type: 'scheduled-today', label: 'Scheduled Today', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      } else if (activityStart.getTime() === tomorrowStart.getTime()) {
        return { type: 'scheduled-tomorrow', label: 'Tomorrow', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
      } else if (startDate > tomorrowStart) {
        const daysFromNow = Math.ceil((activityStart.getTime() - todayStart.getTime()) / (24 * 60 * 60 * 1000));
        return { 
          type: 'scheduled-future', 
          label: `In ${daysFromNow} day${daysFromNow > 1 ? 's' : ''}`, 
          color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' 
        };
      }
    }
    
    // Past activities
    if (endDate && endDate < now) {
      return { type: 'completed', label: 'Completed', color: 'bg-gray-600/50 text-gray-300 border-gray-600/30' };
    }
    
    // Currently active (started but not ended, and start time has passed)
    if (startDate <= now && !endDate) {
      return { type: 'active', label: 'Active', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    }
    
    // Activities with both start and end time, currently running
    if (startDate <= now && endDate && endDate > now) {
      return { type: 'running', label: 'Running', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
    }
    
    return { type: 'completed', label: 'Completed', color: 'bg-gray-600/50 text-gray-300 border-gray-600/30' };
  };
  
  const status = getActivityStatus();
  const isActive = status.type === 'active' || status.type === 'running';
  const isFuture = status.type.startsWith('scheduled');
  
  const duration = endDate && startDate
    ? Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60))
    : Math.round((now.getTime() - startDate.getTime()) / (1000 * 60));

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getCategoryColor = (category: string | null) => {
    if (!category) return 'bg-gray-600 text-gray-200';
    
    const colors = {
      'Olahraga': 'bg-green-600 text-green-100',
      'Kerja': 'bg-blue-600 text-blue-100',
      'Belajar': 'bg-purple-600 text-purple-100',
      'Hobi': 'bg-pink-600 text-pink-100',
      'Kesehatan': 'bg-emerald-600 text-emerald-100',
      'default': 'bg-indigo-600 text-indigo-100'
    };
    
    return colors[category as keyof typeof colors] || colors.default;
  };

  return (
    <>
      <div 
        className={`
          relative bg-gradient-to-br from-gray-800 to-gray-900 
          p-6 rounded-xl shadow-lg border border-gray-700
          ${animationClasses.cardHover}
          ${isActive ? 'ring-2 ring-green-500/50' : ''}
          ${isFuture ? 'ring-2 ring-blue-500/50' : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Status indicator */}
        {(isActive || isFuture) && (
          <div className="absolute -top-1 -right-1">
            <div className={`
              w-4 h-4 rounded-full shadow-lg
              ${isActive ? 'bg-green-500 shadow-green-500/50 animate-pulse' : 'bg-blue-500 shadow-blue-500/50'}
            `} />
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white mb-2 truncate">
              {activity.title}
            </h3>
            
            {activity.category && (
              <span className={`
                inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                ${getCategoryColor(activity.category)}
              `}>
                {activity.category}
              </span>
            )}
          </div>
          
          {/* Status badge */}
          <div className={`
            px-3 py-1 rounded-full text-xs font-medium border
            ${status.color}
          `}>
            {status.label}
          </div>
        </div>

        {/* Date and Time info */}
        <div className="space-y-2 mb-6">
          {/* Date display for future activities */}
          {isFuture && (
            <div className="flex items-center text-blue-300">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">
                {new Date(activity.startTime).toLocaleDateString([], {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          )}
          
          {/* Time display */}
          <div className="flex items-center text-gray-300">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">
              {startTime} {endTime ? `- ${endTime}` : 
                isFuture ? '(Scheduled)' : 
                isActive ? '- In Progress' : ''}
            </span>
          </div>
          
          {/* Duration display */}
          <div className="flex items-center text-gray-400">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm">
              {isFuture ? 'Planned: ' : 'Duration: '}{formatDuration(Math.abs(duration))}
              {duration < 0 && !isFuture && <span className="text-red-400 ml-1">(Overdue)</span>}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className={`
          flex gap-2 transition-all duration-200
          ${isHovered ? 'opacity-100' : 'opacity-70'}
        `}>
          {/* Timer toggle button */}
          {onToggleTimer && (
            <button
              onClick={() => onToggleTimer(activity)}
              disabled={isFuture}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                ${isFuture
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : isActive 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }
                ${!isFuture ? animationClasses.buttonHover : ''}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
                ${!isFuture ? (isActive ? 'focus:ring-red-500' : 'focus:ring-green-500') : 'focus:ring-gray-500'}
              `}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isFuture ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : isActive ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4V8a2 2 0 012-2h6a2 2 0 012 2v2M9 14v6a2 2 0 002 2h2a2 2 0 002-2v-6" />
                )}
              </svg>
              {isFuture ? 'Scheduled' : (isActive ? 'Stop' : 'Resume')}
            </button>
          )}
          
          {/* Edit button */}
          <button
            onClick={() => onEdit(activity)}
            className={`
              flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium
              hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800
              ${animationClasses.buttonHover}
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          
          {/* Delete button */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className={`
              flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium
              hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800
              ${animationClasses.buttonHover}
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => onDelete(activity.id)}
        title="Delete Activity"
        message={`Are you sure you want to delete "${activity.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        type="danger"
      />
    </>
  );
};