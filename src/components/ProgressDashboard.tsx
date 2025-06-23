import React from 'react';
import { ProgressCircle } from './ProgressCircle';
import { DailyEntry } from '../types';
import { formatDate } from '../utils/dateUtils';
import { TrendingUp, Calendar, Target } from 'lucide-react';

interface ProgressDashboardProps {
  dailyEntries: DailyEntry[];
  totalImprovements: number;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  dailyEntries,
  totalImprovements
}) => {
  const calculateDayProgress = (entry: DailyEntry) => {
    const improvements = Object.values(entry.improvements);
    const attempted = improvements.filter(imp => imp.attempted).length;
    const totalEffort = improvements.reduce((sum, imp) => sum + (imp.effortLevel || 0), 0);
    const avgEffort = attempted > 0 ? totalEffort / attempted : 0;
    
    return {
      attempted,
      percentage: totalImprovements > 0 ? (attempted / totalImprovements) * 100 : 0,
      avgEffort
    };
  };

  const recentEntries = dailyEntries
    .slice(-7)
    .reverse()
    .map(entry => ({
      ...entry,
      progress: calculateDayProgress(entry)
    }));

  const overallProgress = dailyEntries.length > 0 
    ? recentEntries.reduce((sum, entry) => sum + entry.progress.percentage, 0) / recentEntries.length
    : 0;

  const overallEffort = dailyEntries.length > 0
    ? recentEntries.reduce((sum, entry) => sum + entry.progress.avgEffort, 0) / recentEntries.filter(e => e.progress.avgEffort > 0).length
    : 0;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-800">לוח התקדמות</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="text-center">
          <ProgressCircle
            percentage={overallProgress}
            size={80}
            color="#8B5CF6"
            strokeWidth={6}
          />
          <p className="text-sm font-medium text-gray-700 mt-2">התקדמות כללית</p>
        </div>

        <div className="text-center">
          <ProgressCircle
            percentage={overallEffort * 20}
            size={80}
            color="#F59E0B"
            strokeWidth={6}
            showText={false}
          />
          <div className="text-2xl font-bold text-gray-800 mt-2">
            {overallEffort.toFixed(1)}
          </div>
          <p className="text-sm font-medium text-gray-700">ממוצע מאמץ</p>
        </div>

        <div className="text-center flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-gray-800">
            {totalImprovements}
          </div>
          <p className="text-sm font-medium text-gray-700">תחומי שיפור</p>
          <Target className="w-4 h-4 text-gray-500 mt-1" />
        </div>
      </div>

      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          התקדמות אחרונה
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {recentEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white/70 backdrop-blur border border-white/50 rounded-lg p-3 hover:bg-white/90 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {formatDate(entry.date)}
                </span>
                <ProgressCircle
                  percentage={entry.progress.percentage}
                  size={40}
                  strokeWidth={3}
                  showText={false}
                  color="#8B5CF6"
                />
              </div>
              <div className="text-xs text-gray-600">
                {entry.progress.attempted}/{totalImprovements} הושלמו
              </div>
              {entry.progress.avgEffort > 0 && (
                <div className="text-xs text-yellow-600 font-medium">
                  ממוצע: {entry.progress.avgEffort.toFixed(1)}/5
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};