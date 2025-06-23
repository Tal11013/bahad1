import React from 'react';
import { Target, Shield, Crown, Users, Calendar, Star, MessageSquare } from 'lucide-react';
import { Improvement, DailyEntry } from '../types';
import { formatDate } from '../utils/dateUtils';

interface ImprovementTableProps {
  improvements: Improvement[];
  dailyEntries: DailyEntry[];
  type: 'improvement' | 'preservation';
}

export const ImprovementTable: React.FC<ImprovementTableProps> = ({
  improvements,
  dailyEntries,
  type
}) => {
  const Icon = type === 'improvement' ? Target : Shield;
  const title = type === 'improvement' ? 'טבלת שיפור' : 'טבלת שימור';
  const colorClass = type === 'improvement' ? 'text-blue-600' : 'text-green-600';
  const bgClass = type === 'improvement' ? 'bg-blue-50' : 'bg-green-50';
  const borderClass = type === 'improvement' ? 'border-blue-200' : 'border-green-200';

  // Get all entries for these improvements, sorted by date (newest first)
  const getEntriesForImprovements = () => {
    const entries: Array<{
      date: string;
      improvement: Improvement;
      data: any;
    }> = [];

    improvements.forEach(improvement => {
      dailyEntries.forEach(entry => {
        if (entry.improvements[improvement.id]) {
          entries.push({
            date: entry.date,
            improvement,
            data: entry.improvements[improvement.id]
          });
        }
      });
    });

    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const entries = getEntriesForImprovements();

  if (entries.length === 0) {
    return (
      <div className={`${bgClass} border ${borderClass} rounded-xl p-6 text-center`}>
        <Icon className={`w-12 h-12 ${colorClass} mx-auto mb-3 opacity-50`} />
        <h3 className={`text-lg font-semibold ${colorClass} mb-2`}>
          אין עדיין נתונים ב{title.toLowerCase()}
        </h3>
        <p className="text-gray-600 text-sm">
          התחל למלא נתונים יומיים כדי לראות את הטבלה
        </p>
      </div>
    );
  }

  return (
    <div className={`${bgClass} border ${borderClass} rounded-xl p-4`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${colorClass}`} />
        <h2 className={`text-lg font-semibold ${colorClass}`}>{title}</h2>
        <span className="text-sm text-gray-500">({entries.length} רשומות)</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-right p-3 font-semibold text-gray-700">
                <div className="flex items-center justify-end gap-1">
                  <Calendar className="w-4 h-4" />
                  תאריך
                </div>
              </th>
              <th className="text-right p-3 font-semibold text-gray-700">תחום</th>
              <th className="text-right p-3 font-semibold text-gray-700">מקור</th>
              {type === 'improvement' ? (
                <>
                  <th className="text-center p-3 font-semibold text-gray-700">ניסיתי</th>
                  <th className="text-center p-3 font-semibold text-gray-700">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4" />
                      מאמץ
                    </div>
                  </th>
                  <th className="text-right p-3 font-semibold text-gray-700">
                    <div className="flex items-center justify-end gap-1">
                      <MessageSquare className="w-4 h-4" />
                      יוזמה
                    </div>
                  </th>
                </>
              ) : (
                <th className="text-right p-3 font-semibold text-gray-700">
                  <div className="flex items-center justify-end gap-1">
                    <MessageSquare className="w-4 h-4" />
                    תוכן
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={`${entry.improvement.id}-${entry.date}`} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'} hover:bg-blue-50/30 transition-colors`}>
                <td className="p-3 text-right font-medium text-gray-800">
                  {formatDate(entry.date)}
                </td>
                <td className="p-3 text-right text-gray-700 max-w-xs">
                  <div className="truncate" title={entry.improvement.text}>
                    {entry.improvement.text}
                  </div>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {entry.improvement.source === 'commander' ? (
                      <>
                        <Crown className="w-3 h-3 text-purple-600" />
                        <span className="text-xs text-purple-600 font-medium">מפקד</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-3 h-3 text-orange-600" />
                        <span className="text-xs text-orange-600 font-medium">חבר צוות</span>
                      </>
                    )}
                  </div>
                </td>
                {type === 'improvement' ? (
                  <>
                    <td className="p-3 text-center">
                      {entry.data.attempted ? (
                        <div className="inline-flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-6 h-6 bg-gray-300 rounded-full">
                          <span className="text-gray-600 text-xs">✗</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= (entry.data.effortLevel || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-gray-600 mr-1">
                          ({entry.data.effortLevel || 0})
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-right max-w-xs">
                      <div className="text-sm text-gray-700 truncate" title={entry.data.initiative}>
                        {entry.data.initiative || '-'}
                      </div>
                    </td>
                  </>
                ) : (
                  <td className="p-3 text-right max-w-xs">
                    <div className="text-sm text-gray-700 truncate" title={entry.data.content}>
                      {entry.data.content || '-'}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};