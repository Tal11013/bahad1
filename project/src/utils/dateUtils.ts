import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { he } from 'date-fns/locale';

export const formatDate = (date: string): string => {
  const dateObj = parseISO(date);
  
  if (isToday(dateObj)) {
    return 'היום';
  }
  
  if (isYesterday(dateObj)) {
    return 'אתמול';
  }
  
  return format(dateObj, 'dd MMMM yyyy', { locale: he });
};

export const getTodayString = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const getDateKey = (date: Date = new Date()): string => {
  return format(date, 'yyyy-MM-dd');
};