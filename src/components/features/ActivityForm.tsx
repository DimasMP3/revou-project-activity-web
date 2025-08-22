import React, { useState, useEffect } from 'react';
import { animationClasses } from '../ui/animations';
import { Activity } from './ActivityCard';

interface ActivityFormProps {
  onSubmit: (data: { 
    title: string; 
    category: string; 
    startTime?: Date;
    endTime?: Date;
    duration?: number; // in minutes
  }) => void;
  activityToEdit: Activity | null;
  onClearEdit: () => void;
  isLoading?: boolean;
}

const categories = [
  { value: 'Olahraga', icon: '🏃‍♂️', color: 'text-green-400' },
  { value: 'Kerja', icon: '💼', color: 'text-blue-400' },
  { value: 'Belajar', icon: '📚', color: 'text-purple-400' },
  { value: 'Hobi', icon: '🎨', color: 'text-pink-400' },
  { value: 'Kesehatan', icon: '🏥', color: 'text-emerald-400' },
  { value: 'Lainnya', icon: '📋', color: 'text-gray-400' }
];

const durationPresets = [
  { label: '15 minutes', value: 15, icon: '⚡' },
  { label: '30 minutes', value: 30, icon: '⏰' },
  { label: '45 minutes', value: 45, icon: '📊' },
  { label: '1 hour', value: 60, icon: '🎯' },
  { label: '2 hours', value: 120, icon: '🔥' },
  { label: '4 hours', value: 240, icon: '💪' }
];

export const ActivityForm: React.FC<ActivityFormProps> = ({ 
  onSubmit, 
  activityToEdit, 
  onClearEdit,
  isLoading = false 
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [timeMode, setTimeMode] = useState<'live' | 'custom' | 'duration'>('live'); // live tracking, custom times, or preset duration
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [customDuration, setCustomDuration] = useState('');
  const [errors, setErrors] = useState<{ title?: string; category?: string; time?: string }>({});
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (activityToEdit) {
      setTitle(activityToEdit.title);
      setCategory(activityToEdit.category || '');
      setTimeMode('custom');
      
      // Convert ISO strings to datetime-local format
      const startDate = new Date(activityToEdit.startTime);
      const endDate = activityToEdit.endTime ? new Date(activityToEdit.endTime) : null;
      
      // Format for datetime-local input
      const formatDateTime = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };
      
      setStartTime(formatDateTime(startDate));
      if (endDate) {
        setEndTime(formatDateTime(endDate));
      }
      
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
      // Reset to current time for new activities
      const now = new Date();
      const formatDateTime = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };
      setStartTime(formatDateTime(now));
      setEndTime('');
    }
  }, [activityToEdit]);

  const validateForm = () => {
    const newErrors: { title?: string; category?: string; time?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Activity title is required';
    } else if (title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters long';
    }
    
    // Validate time settings for custom and duration modes
    if (timeMode === 'custom') {
      if (!startTime) {
        newErrors.time = 'Start time is required';
      } else if (endTime && new Date(startTime) >= new Date(endTime)) {
        newErrors.time = 'End time must be after start time';
      }
    } else if (timeMode === 'duration') {
      if (!selectedDuration && !customDuration) {
        newErrors.time = 'Please select or enter a duration';
      } else if (customDuration && (isNaN(Number(customDuration)) || Number(customDuration) <= 0)) {
        newErrors.time = 'Duration must be a positive number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Prepare submission data based on time mode
    const submissionData: {
      title: string;
      category: string;
      startTime?: Date;
      endTime?: Date;
      duration?: number;
    } = {
      title: title.trim(),
      category
    };
    
    if (timeMode === 'custom') {
      submissionData.startTime = new Date(startTime);
      if (endTime) {
        submissionData.endTime = new Date(endTime);
      }
    } else if (timeMode === 'duration') {
      const durationMinutes = selectedDuration || Number(customDuration);
      const start = new Date();
      const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
      
      submissionData.startTime = start;
      submissionData.endTime = end;
      submissionData.duration = durationMinutes;
    }
    // For 'live' mode, we don't set startTime/endTime, let the server handle it
    
    onSubmit(submissionData);
    
    if (!activityToEdit) {
      setTitle('');
      setCategory('');
      setTimeMode('live');
      setSelectedDuration(null);
      setCustomDuration('');
      setIsExpanded(false);
    }
    
    setErrors({});
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (errors.title) {
      setErrors({ ...errors, title: undefined });
    }
  };

  const getQuickStartSuggestions = () => [
    { title: 'Lari Pagi', category: 'Olahraga', icon: '🏃‍♂️', duration: 30 },
    { title: 'Baca Buku', category: 'Belajar', icon: '📚', duration: 60 },
    { title: 'Meeting Tim', category: 'Kerja', icon: '💼', duration: 45 },
    { title: 'Meditasi', category: 'Kesehatan', icon: '🧘‍♂️', duration: 15 }
  ];

  return (
    <div className={`
      bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700
      ${animationClasses.fadeIn}
    `}>
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {activityToEdit ? 'Edit Activity' : 'Start New Activity'}
            </h2>
            <p className="text-gray-400">
              {activityToEdit ? 'Update your activity details' : 'Track your time and boost productivity'}
            </p>
          </div>
          
          {!isExpanded && !activityToEdit && (
            <button
              onClick={() => setIsExpanded(true)}
              className={`
                bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium
                shadow-lg shadow-indigo-500/25 ${animationClasses.buttonHover}
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800
              `}
            >
              Quick Start
            </button>
          )}
        </div>
      </div>

      {/* Quick Start Suggestions */}
      {!isExpanded && !activityToEdit && (
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Start</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {getQuickStartSuggestions().map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  const start = new Date();
                  const end = new Date(start.getTime() + suggestion.duration * 60 * 1000);
                  onSubmit({ 
                    title: suggestion.title, 
                    category: suggestion.category,
                    startTime: start,
                    endTime: end,
                    duration: suggestion.duration
                  });
                }}
                className={`
                  p-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-left
                  border border-gray-600 hover:border-indigo-500
                  ${animationClasses.buttonHover}
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                `}
              >
                <div className="text-2xl mb-2">{suggestion.icon}</div>
                <div className="text-white font-medium text-sm mb-1">{suggestion.title}</div>
                <div className="text-gray-400 text-xs mb-1">{suggestion.category}</div>
                <div className="text-indigo-400 text-xs">{suggestion.duration} minutes</div>
              </button>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsExpanded(true)}
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
            >
              Or create custom activity →
            </button>
          </div>
        </div>
      )}

      {/* Full Form */}
      {(isExpanded || activityToEdit) && (
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Activity Title *
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g., Morning Workout, Study Session, Project Review"
                value={title}
                onChange={handleTitleChange}
                className={`
                  w-full bg-gray-700 text-white p-4 rounded-xl border transition-colors
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${errors.title 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-600 focus:border-indigo-500'
                  }
                `}
                disabled={isLoading}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.title}
                </p>
              )}
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Category
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(category === cat.value ? '' : cat.value)}
                    className={`
                      p-4 rounded-xl border transition-all text-left
                      ${category === cat.value
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                      }
                      ${animationClasses.buttonHover}
                      focus:outline-none focus:ring-2 focus:ring-indigo-500
                    `}
                    disabled={isLoading}
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{cat.icon}</span>
                      <span className="font-medium">{cat.value}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Mode Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Time Settings
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setTimeMode('live')}
                  className={`
                    p-4 rounded-xl border transition-all text-left
                    ${timeMode === 'live'
                      ? 'bg-green-600 border-green-500 text-white shadow-lg shadow-green-500/25'
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                    }
                    ${animationClasses.buttonHover}
                    focus:outline-none focus:ring-2 focus:ring-green-500
                  `}
                  disabled={isLoading}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🟢</span>
                    <div>
                      <div className="font-medium">Live Tracking</div>
                      <div className="text-xs opacity-75">Start now, stop manually</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTimeMode('duration')}
                  className={`
                    p-4 rounded-xl border transition-all text-left
                    ${timeMode === 'duration'
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                    }
                    ${animationClasses.buttonHover}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                  disabled={isLoading}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">⏰</span>
                    <div>
                      <div className="font-medium">Set Duration</div>
                      <div className="text-xs opacity-75">Quick preset durations</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTimeMode('custom')}
                  className={`
                    p-4 rounded-xl border transition-all text-left
                    ${timeMode === 'custom'
                      ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                    }
                    ${animationClasses.buttonHover}
                    focus:outline-none focus:ring-2 focus:ring-purple-500
                  `}
                  disabled={isLoading}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🕐</span>
                    <div>
                      <div className="font-medium">Custom Times</div>
                      <div className="text-xs opacity-75">Set specific start/end times</div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Duration Presets */}
              {timeMode === 'duration' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Quick Duration Presets
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {durationPresets.map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => {
                            setSelectedDuration(preset.value);
                            setCustomDuration('');
                          }}
                          className={`
                            p-3 rounded-lg border transition-all text-left text-sm
                            ${selectedDuration === preset.value
                              ? 'bg-blue-600 border-blue-500 text-white'
                              : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                            }
                            ${animationClasses.buttonHover}
                          `}
                          disabled={isLoading}
                        >
                          <div className="flex items-center justify-between">
                            <span>{preset.icon} {preset.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Or Custom Duration (minutes)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 90 for 1.5 hours"
                      value={customDuration}
                      onChange={(e) => {
                        setCustomDuration(e.target.value);
                        setSelectedDuration(null);
                      }}
                      className="
                        w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        transition-colors
                      "
                      disabled={isLoading}
                      min="1"
                    />
                  </div>
                </div>
              )}

              {/* Custom Time Inputs */}
              {timeMode === 'custom' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="
                        w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600
                        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                        transition-colors
                      "
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      End Time (optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="
                        w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600
                        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                        transition-colors
                      "
                      disabled={isLoading}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Leave empty for ongoing activity
                    </p>
                  </div>
                </div>
              )}

              {/* Time Error Display */}
              {errors.time && (
                <p className="mt-2 text-sm text-red-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.time}
                </p>
              )}
              
              {/* Time Preview */}
              {(timeMode === 'custom' && startTime) && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Activity Preview
                  </h4>
                  
                  {(() => {
                    const start = new Date(startTime);
                    const end = endTime ? new Date(endTime) : null;
                    const now = new Date();
                    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    const activityStart = new Date(start.getFullYear(), start.getMonth(), start.getDate());
                    
                    const getRelativeTime = () => {
                      if (activityStart.getTime() === todayStart.getTime()) {
                        if (start > now) {
                          return { type: 'today-future', label: 'Later today', color: 'text-blue-400' };
                        } else {
                          return { type: 'today-past', label: 'Earlier today', color: 'text-yellow-400' };
                        }
                      } else if (activityStart.getTime() === todayStart.getTime() + 24 * 60 * 60 * 1000) {
                        return { type: 'tomorrow', label: 'Tomorrow', color: 'text-purple-400' };
                      } else if (start > now) {
                        const days = Math.ceil((activityStart.getTime() - todayStart.getTime()) / (24 * 60 * 60 * 1000));
                        return { type: 'future', label: `In ${days} day${days > 1 ? 's' : ''}`, color: 'text-indigo-400' };
                      } else {
                        const days = Math.ceil((todayStart.getTime() - activityStart.getTime()) / (24 * 60 * 60 * 1000));
                        return { type: 'past', label: `${days} day${days > 1 ? 's' : ''} ago`, color: 'text-gray-400' };
                      }
                    };
                    
                    const timeInfo = getRelativeTime();
                    const duration = end ? Math.round((end.getTime() - start.getTime()) / (1000 * 60)) : null;
                    
                    return (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">
                            📅 {start.toLocaleDateString([], { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                          <span className={`text-sm font-medium ${timeInfo.color}`}>
                            {timeInfo.label}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">
                            🕐 {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {end && ` - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                          </span>
                          {duration && (
                            <span className="text-gray-400 text-sm">
                              ⏱️ {Math.floor(duration / 60)}h {duration % 60}m
                            </span>
                          )}
                        </div>
                        
                        {timeInfo.type.includes('future') && (
                          <div className="mt-2 text-xs text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full inline-flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            This activity will be scheduled for the future
                          </div>
                        )}
                      </div>
                    );
                  })()
                  }
                </div>
              )}
              
              {(timeMode === 'duration' && (selectedDuration || customDuration)) && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Duration Preview
                  </h4>
                  
                  {(() => {
                    const duration = selectedDuration || Number(customDuration);
                    const start = new Date();
                    const end = new Date(start.getTime() + duration * 60 * 1000);
                    
                    return (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">
                            🚀 Starts now
                          </span>
                          <span className="text-green-400 text-sm font-medium">
                            Immediate start
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">
                            ⏰ Ends at {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-indigo-400 text-sm">
                            ⏱️ {Math.floor(duration / 60)}h {duration % 60}m
                          </span>
                        </div>
                        
                        <div className="mt-2 text-xs text-green-300 bg-green-500/10 px-3 py-1 rounded-full inline-flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Activity will auto-complete in {Math.floor(duration / 60)}h {duration % 60}m
                        </div>
                      </div>
                    );
                  })()
                  }
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl font-medium
                  shadow-lg shadow-indigo-500/25 ${animationClasses.buttonHover}
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2
                `}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {activityToEdit ? 'Update Activity' : 'Start Tracking'}
                  </>
                )}
              </button>
              
              {(activityToEdit || isExpanded) && (
                <button
                  type="button"
                  onClick={() => {
                    if (activityToEdit) {
                      onClearEdit();
                    } else {
                      setIsExpanded(false);
                      setTitle('');
                      setCategory('');
                      setTimeMode('live');
                      setStartTime('');
                      setEndTime('');
                      setSelectedDuration(null);
                      setCustomDuration('');
                      setErrors({});
                    }
                  }}
                  disabled={isLoading}
                  className={`
                    px-6 py-4 bg-gray-700 text-gray-300 rounded-xl font-medium
                    hover:bg-gray-600 ${animationClasses.buttonHover}
                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};