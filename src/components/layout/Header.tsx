import React, { useState } from 'react';
import { animationClasses } from '../ui/animations';
import { Activity } from '../features/ActivityCard';

interface HeaderProps {
  activities: Activity[];
  onShowStats?: () => void;
  showStats?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  activities, 
  onShowStats,
  showStats = false 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const activeActivities = activities.filter(a => !a.endTime);
  const todayActivities = activities.filter(a => 
    new Date(a.startTime).toDateString() === new Date().toDateString()
  );

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className={`
      bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 
      border-b border-gray-700 ${animationClasses.fadeIn}
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {/* Animated logo */}
              <div className="relative">
                <div className={`
                  w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 
                  rounded-xl shadow-lg shadow-indigo-500/25
                  flex items-center justify-center
                  ${animationClasses.hover}
                `}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                
                {/* Active indicator */}
                {activeActivities.length > 0 && (
                  <div className="absolute -top-1 -right-1">
                    <div className={`
                      w-4 h-4 bg-green-500 rounded-full 
                      ${animationClasses.pulse}
                      shadow-lg shadow-green-500/50
                    `} />
                  </div>
                )}
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Dimas Activity Tracker
                </h1>
                <p className="text-gray-400 text-sm">
                  My personal productivity
                </p>
              </div>
            </div>
          </div>

          {/* Center - Time and Date */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-mono font-bold text-white">
                {formatTime(currentTime)}
              </div>
              <div className="text-gray-400 text-sm">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>

          {/* Right - Quick Stats and Actions */}
          <div className="flex items-center space-x-4">
            {/* Quick Stats */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Active Activities */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className={`
                    w-3 h-3 rounded-full
                    ${activeActivities.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}
                  `} />
                  <span className="text-2xl font-bold text-white">
                    {activeActivities.length}
                  </span>
                </div>
                <div className="text-gray-400 text-xs">Active</div>
              </div>

              {/* Today's Activities */}
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {todayActivities.length}
                </div>
                <div className="text-gray-400 text-xs">Today</div>
              </div>

              {/* Total Activities */}
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {activities.length}
                </div>
                <div className="text-gray-400 text-xs">Total</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {/* Stats Toggle */}
              {onShowStats && (
                <button
                  onClick={onShowStats}
                  className={`
                    p-3 rounded-xl border transition-all
                    ${showStats 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25' 
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                    }
                    ${animationClasses.buttonHover}
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900
                  `}
                  title={showStats ? 'Hide Statistics' : 'Show Statistics'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </button>
              )}

              {/* Settings */}
              <button
                className={`
                  p-3 bg-gray-700 border border-gray-600 text-gray-300 rounded-xl
                  hover:bg-gray-600 ${animationClasses.buttonHover}
                  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900
                `}
                title="Settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Quick Stats */}
        <div className="lg:hidden pb-4">
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className={`
                  w-2 h-2 rounded-full
                  ${activeActivities.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}
                `} />
                <span className="text-lg font-bold text-white">
                  {activeActivities.length}
                </span>
              </div>
              <div className="text-gray-400 text-xs">Active</div>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {todayActivities.length}
              </div>
              <div className="text-gray-400 text-xs">Today</div>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {activities.length}
              </div>
              <div className="text-gray-400 text-xs">Total</div>
            </div>
          </div>
        </div>

        {/* Mobile Time Display */}
        <div className="md:hidden pb-4 text-center">
          <div className="text-xl font-mono font-bold text-white">
            {formatTime(currentTime)}
          </div>
          <div className="text-gray-400 text-sm">
            {formatDate(currentTime)}
          </div>
        </div>
      </div>
    </header>
  );
};