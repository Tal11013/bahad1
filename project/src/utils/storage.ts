import { UserData, Improvement, DailyEntry } from '../types';

const STORAGE_KEY = 'improvement-tracker';

export const generateUserId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const getUserIdFromUrl = (): string => {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('user');
  
  if (userId) {
    return userId;
  }
  
  const newUserId = generateUserId();
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set('user', newUserId);
  window.history.replaceState({}, '', newUrl.toString());
  
  return newUserId;
};

export const saveUserData = (userData: UserData): void => {
  const allData = getAllData();
  allData[userData.userId] = userData;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
};

export const getUserData = (userId: string): UserData => {
  const allData = getAllData();
  return allData[userId] || {
    userId,
    improvements: [],
    dailyEntries: []
  };
};

const getAllData = (): { [key: string]: UserData } => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const getShareableUrl = (userId: string): string => {
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('user', userId);
  return url.toString();
};