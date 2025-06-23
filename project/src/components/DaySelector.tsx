import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { formatDate, getTodayString } from '../utils/dateUtils';
import { format, addDays, subDays, parseISO } from 'date-fns';

interface DaySelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  availableDates: string[];
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDate,
  onDateChange,
  availableDates
}) => {
  const currentDate = parseISO(selectedDate);
  const today = getTodayString();

  const goToPreviousDay = () => {
    const prevDay = format(subDays(currentDate, 1), 'yyyy-MM-dd');
    onDateChange(prevDay);
  };

  const goToNextDay = () => {
    const nextDay = format(addDays(currentDate, 1), 'yyyy-MM-dd');
    onDateChange(nextDay);
  };

  const goToToday = () => {
    onDateChange(today);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousDay}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">
            {formatDate(selectedDate)}
          </h2>
        </div>

        <button
          onClick={goToNextDay}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex justify-center mt-3">
        {selectedDate !== today && (
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            עבור להיום
          </button>
        )}
      </div>

      {availableDates.length > 1 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2 text-right">תאריכים זמינים:</p>
          <div className="flex flex-wrap gap-1 justify-end">
            {availableDates.slice(-10).map((date) => (
              <button
                key={date}
                onClick={() => onDateChange(date)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  date === selectedDate
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {format(parseISO(date), 'dd/MM')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};