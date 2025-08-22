import React from 'react';
import { animationClasses } from '../ui/animations';
import { Activity } from './ActivityCard';

interface StatisticsProps {
  activities: Activity[];
}

export const Statistics: React.FC<StatisticsProps> = ({ activities }) => {
  const calculateStats = () => {
    const today = new Date();
    const todayStr = today.toDateString();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const todayActivities = activities.filter(a => 
      new Date(a.startTime).toDateString() === todayStr
    );
    
    const weekActivities = activities.filter(a => 
      new Date(a.startTime) >= weekAgo
    );
    
    const activeActivities = activities.filter(a => {
      const startDate = new Date(a.startTime);
      return !a.endTime && startDate <= today;
    });
    
    const scheduledActivities = activities.filter(a => {
      const startDate = new Date(a.startTime);
      return startDate > today;
    });
    
    const completedActivities = activities.filter(a => {
      const endDate = a.endTime ? new Date(a.endTime) : null;
      return endDate && endDate < today;
    });
    
    const totalDuration = activities.reduce((total, activity) => {
      if (activity.endTime) {
        return total + (new Date(activity.endTime).getTime() - new Date(activity.startTime).getTime());
      }
      return total + (new Date().getTime() - new Date(activity.startTime).getTime());
    }, 0);
    
    const todayDuration = todayActivities.reduce((total, activity) => {
      if (activity.endTime) {
        return total + (new Date(activity.endTime).getTime() - new Date(activity.startTime).getTime());
      }
      return total + (new Date().getTime() - new Date(activity.startTime).getTime());
    }, 0);
    
    // Category breakdown
    const categoryStats = activities.reduce((acc, activity) => {
      const cat = activity.category || 'Uncategorized';
      if (!acc[cat]) {
        acc[cat] = { count: 0, duration: 0 };
      }
      acc[cat].count++;
      
      if (activity.endTime) {
        acc[cat].duration += new Date(activity.endTime).getTime() - new Date(activity.startTime).getTime();
      } else {
        acc[cat].duration += new Date().getTime() - new Date(activity.startTime).getTime();
      }
      
      return acc;
    }, {} as Record<string, { count: number; duration: number }>);
    
    return {
      total: activities.length,
      today: todayActivities.length,
      week: weekActivities.length,
      active: activeActivities.length,
      scheduled: scheduledActivities.length,
      completed: completedActivities.length,
      totalDuration: Math.round(totalDuration / (1000 * 60 * 60)), // hours
      todayDuration: Math.round(todayDuration / (1000 * 60)), // minutes
      categoryStats
    };
  };

  const stats = calculateStats();
  
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    color = 'indigo',
    trend 
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color?: string;
    trend?: { value: number; label: string };
  }) => {
    const colorClasses = {
      indigo: 'from-indigo-600 to-indigo-700 shadow-indigo-500/25',
      green: 'from-green-600 to-green-700 shadow-green-500/25',
      blue: 'from-blue-600 to-blue-700 shadow-blue-500/25',
      purple: 'from-purple-600 to-purple-700 shadow-purple-500/25',
      orange: 'from-orange-600 to-orange-700 shadow-orange-500/25'
    };

    return (
      <div className={`
        bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} 
        p-6 rounded-xl shadow-lg ${animationClasses.cardHover}
        relative overflow-hidden
      `}>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white/80">{icon}</div>
            {trend && (
              <div className={`
                flex items-center text-xs font-medium px-2 py-1 rounded-full
                ${trend.value >= 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}
              `}>
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d={trend.value >= 0 ? "M7 17l9.2-9.2M17 17V7h-10" : "M17 7l-9.2 9.2M7 7v10h10"} 
                  />
                </svg>
                {trend.label}
              </div>
            )}
          </div>
          
          <div className="text-3xl font-bold text-white mb-1">
            {value}
          </div>
          
          <div className="text-white/70 text-sm">
            {title}
          </div>
          
          {subtitle && (
            <div className="text-white/50 text-xs mt-1">
              {subtitle}
            </div>
          )}
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
      </div>
    );
  };

  const topCategories = Object.entries(stats.categoryStats)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className={`space-y-6 ${animationClasses.fadeIn}`}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Activities"
          value={stats.total}
          subtitle="All time"
          color="indigo"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        
        <StatCard
          title="Today's Activities"
          value={stats.today}
          subtitle={formatDuration(stats.todayDuration)}
          color="green"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        
        <StatCard
          title="Active Now"
          value={stats.active}
          subtitle="Currently running"
          color="orange"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        
        <StatCard
          title="Scheduled"
          value={stats.scheduled}
          subtitle="Future activities"
          color="blue"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        
        <StatCard
          title="This Week"
          value={stats.week}
          subtitle="Last 7 days"
          color="purple"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
      </div>

      {/* Category Breakdown */}
      {topCategories.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Top Categories
          </h3>
          
          <div className="space-y-3">
            {topCategories.map(([category, data], index) => {
              const percentage = stats.total > 0 ? (data.count / stats.total) * 100 : 0;
              const hours = Math.round(data.duration / (1000 * 60 * 60 * 10)) / 10; // 1 decimal place
              
              return (
                <div key={category} className="flex items-center">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium">{category}</span>
                      <div className="text-gray-400 text-sm">
                        {data.count} activities • {hours}h
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                          index === 0 ? 'bg-indigo-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-blue-500' :
                          index === 3 ? 'bg-purple-500' :
                          'bg-orange-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Weekly Progress */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Weekly Goal Progress
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Activities Goal</span>
              <span className="text-white font-medium">{stats.week}/10</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min((stats.week / 10) * 100, 100)}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Time Goal</span>
              <span className="text-white font-medium">{stats.totalDuration}/40h</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min((stats.totalDuration / 40) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};