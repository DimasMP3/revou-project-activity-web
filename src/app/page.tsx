"use client";

import { useEffect, useState, useTransition } from 'react';
import { createActivity, deleteActivity, getActivities, updateActivity } from './actions';
import { Header } from '@/components/layout';
import { ActivityCard, ActivityForm, Statistics, SearchAndFilter } from '@/components/features';
import { LoadingScreen, EmptyState, animationClasses } from '@/components/ui';
import type { Activity } from '@/components/features/ActivityCard';

export default function Home() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedActivities = await getActivities();
        const convertedActivities = convertActivityDates(fetchedActivities);
        setActivities(convertedActivities);
        setFilteredActivities(convertedActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Convert database dates to strings for consistency
  const convertActivityDates = (activities: any[]): Activity[] => {
    return activities.map(activity => ({
      ...activity,
      startTime: activity.startTime instanceof Date ? activity.startTime.toISOString() : activity.startTime,
      endTime: activity.endTime ? (activity.endTime instanceof Date ? activity.endTime.toISOString() : activity.endTime) : null,
      createdAt: activity.createdAt instanceof Date ? activity.createdAt.toISOString() : activity.createdAt,
    }));
  };

  const refreshActivities = async () => {
    const updatedActivities = await getActivities();
    const convertedActivities = convertActivityDates(updatedActivities);
    setActivities(convertedActivities);
    setFilteredActivities(convertedActivities);
  };

  const handleSubmit = (data: { 
    title: string; 
    category: string;
    startTime?: Date;
    endTime?: Date;
    duration?: number;
  }) => {
    startTransition(async () => {
      try {
        if (activityToEdit) {
          // For updates, pass all the data
          await updateActivity(activityToEdit.id, {
            title: data.title,
            category: data.category,
            ...(data.startTime && { startTime: data.startTime }),
            ...(data.endTime && { endTime: data.endTime })
          });
        } else {
          // For new activities, include time data if provided
          const createData = {
            title: data.title,
            category: data.category,
            userId: '00000000-0000-0000-0000-000000000000',
            ...(data.startTime && { startTime: data.startTime }),
            ...(data.endTime && { endTime: data.endTime })
          };
          await createActivity(createData);
        }
        await refreshActivities();
        setActivityToEdit(null);
      } catch (error) {
        console.error('Error submitting activity:', error);
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteActivity(id);
        await refreshActivities();
      } catch (error) {
        console.error('Error deleting activity:', error);
      }
    });
  };

  const handleToggleTimer = async (activity: Activity) => {
    startTransition(async () => {
      try {
        if (activity.endTime) {
          // Resume activity by removing end time (set to undefined to remove the field)
          await updateActivity(activity.id, { endTime: null as any });
        } else {
          // Stop activity by setting end time
          await updateActivity(activity.id, { endTime: new Date() });
        }
        await refreshActivities();
      } catch (error) {
        console.error('Error toggling timer:', error);
      }
    });
  };

  const scrollToForm = () => {
    document.getElementById('activity-form')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  if (loading) {
    return <LoadingScreen message="Loading your activities..." />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <Header 
        activities={activities}
        onShowStats={() => setShowStats(!showStats)}
        showStats={showStats}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Statistics Section */}
          {showStats && (
            <section className={`${animationClasses.slideIn}`}>
              <Statistics activities={activities} />
            </section>
          )}

          {/* Activity Form */}
          <section id="activity-form" className={animationClasses.fadeIn}>
            <ActivityForm 
              onSubmit={handleSubmit} 
              activityToEdit={activityToEdit} 
              onClearEdit={() => setActivityToEdit(null)}
              isLoading={isPending}
            />
          </section>

          {/* Search and Filter */}
          {activities.length > 0 && (
            <section className={animationClasses.fadeIn}>
              <SearchAndFilter 
                activities={activities}
                onFilteredActivities={setFilteredActivities}
              />
            </section>
          )}

          {/* Loading State */}
          {isPending && (
            <div className="text-center py-8">
              <div className={`inline-flex items-center space-x-3 text-indigo-400 ${animationClasses.pulse}`}>
                <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                <span className="font-medium">Updating activities...</span>
              </div>
            </div>
          )}

          {/* Activities Grid */}
          <section>
            {filteredActivities.length === 0 ? (
              activities.length === 0 ? (
                <EmptyState
                  title="Ready to start tracking?"
                  description="Create your first activity and begin your productivity journey. Track time, organize by categories, and achieve your goals."
                  actionLabel="Start Your First Activity"
                  onAction={scrollToForm}
                  icon={
                    <svg className="w-16 h-16 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
              ) : (
                <div className={animationClasses.fadeIn}>
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-white mb-2">No activities match your search</h3>
                    <p className="text-gray-400 mb-6">Try adjusting your search terms or filters to find what you're looking for.</p>
                    <button
                      onClick={() => window.location.reload()}
                      className={`
                        bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium
                        shadow-lg shadow-indigo-500/25 ${animationClasses.buttonHover}
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900
                      `}
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    {filteredActivities.length === activities.length 
                      ? `All Activities (${activities.length})`
                      : `Filtered Activities (${filteredActivities.length} of ${activities.length})`
                    }
                  </h2>
                  
                  {/* Quick Actions */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowStats(!showStats)}
                      className={`
                        px-4 py-2 text-sm font-medium rounded-lg transition-colors
                        ${showStats 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }
                        ${animationClasses.buttonHover}
                      `}
                    >
                      {showStats ? 'Hide Stats' : 'Show Stats'}
                    </button>
                  </div>
                </div>
                
                <div className={`
                  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
                  ${animationClasses.fadeIn}
                `}>
                  {filteredActivities.map((activity, index) => (
                    <div
                      key={activity.id}
                      className={animationClasses.slideIn}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ActivityCard 
                        activity={activity} 
                        onDelete={handleDelete} 
                        onEdit={setActivityToEdit}
                        onToggleTimer={handleToggleTimer}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Footer */}
          <footer className="text-center py-8 border-t border-gray-700">
            <p className="text-gray-400">
              Semangat beraktivitas nya ya!
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}