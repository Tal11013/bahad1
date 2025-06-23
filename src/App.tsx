import React, { useState, useEffect } from 'react';
import { Improvement, DailyEntry, UserData } from './types';
import { ImprovementCard } from './components/ImprovementCard';
import { AddImprovementForm } from './components/AddImprovementForm';
import { ProgressDashboard } from './components/ProgressDashboard';
import { DaySelector } from './components/DaySelector';
import { ShareButton } from './components/ShareButton';
import { ImprovementTable } from './components/ImprovementTable';
import { 
  getUserIdFromUrl, 
  getUserData, 
  saveUserData, 
  getShareableUrl 
} from './utils/storage';
import { getTodayString } from './utils/dateUtils';
import { Target, Shield, Sparkles, Table } from 'lucide-react';

function App() {
  const [userId] = useState(() => getUserIdFromUrl());
  const [userData, setUserData] = useState<UserData>(() => getUserData(userId));
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [shareUrl] = useState(() => getShareableUrl(userId));
  const [activeTab, setActiveTab] = useState<'daily' | 'tables'>('daily');

  // Save data whenever userData changes
  useEffect(() => {
    saveUserData(userData);
  }, [userData]);

  const addImprovement = (newImprovement: Omit<Improvement, 'id' | 'createdAt'>) => {
    const improvement: Improvement = {
      ...newImprovement,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    setUserData(prev => ({
      ...prev,
      improvements: [...prev.improvements, improvement]
    }));
  };

  const updateImprovement = (id: string, text: string) => {
    setUserData(prev => ({
      ...prev,
      improvements: prev.improvements.map(imp => 
        imp.id === id ? { ...imp, text } : imp
      )
    }));
  };

  const deleteImprovement = (id: string) => {
    setUserData(prev => ({
      ...prev,
      improvements: prev.improvements.filter(imp => imp.id !== id),
      dailyEntries: prev.dailyEntries.map(entry => ({
        ...entry,
        improvements: Object.fromEntries(
          Object.entries(entry.improvements).filter(([impId]) => impId !== id)
        )
      }))
    }));
  };

  const updateDailyEntry = (improvementId: string, data: any) => {
    setUserData(prev => {
      const existingEntryIndex = prev.dailyEntries.findIndex(
        entry => entry.date === selectedDate
      );

      if (existingEntryIndex >= 0) {
        const updatedEntries = [...prev.dailyEntries];
        updatedEntries[existingEntryIndex] = {
          ...updatedEntries[existingEntryIndex],
          improvements: {
            ...updatedEntries[existingEntryIndex].improvements,
            [improvementId]: data
          }
        };
        return { ...prev, dailyEntries: updatedEntries };
      } else {
        const newEntry: DailyEntry = {
          id: Date.now().toString(),
          date: selectedDate,
          improvements: {
            [improvementId]: data
          }
        };
        return {
          ...prev,
          dailyEntries: [...prev.dailyEntries, newEntry]
        };
      }
    });
  };

  const getCurrentDayEntry = () => {
    return userData.dailyEntries.find(entry => entry.date === selectedDate);
  };

  const availableDates = userData.dailyEntries
    .map(entry => entry.date)
    .sort()
    .reverse();

  const currentEntry = getCurrentDayEntry();
  const improvementItems = userData.improvements.filter(imp => imp.type === 'improvement');
  const preservationItems = userData.improvements.filter(imp => imp.type === 'preservation');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              מעקב שיפור אישי
            </h1>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <Target className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            עקוב אחר ההתקדמות היומית שלך בתחומי שיפור ושימור. דרג את המאמצים שלך, רשום פעולות וצפה במסע הצמיחה שלך.
          </p>
        </div>

        {/* Share Button */}
        <div className="mb-6">
          <ShareButton shareUrl={shareUrl} />
        </div>

        {/* Progress Dashboard */}
        {userData.dailyEntries.length > 0 && (
          <div className="mb-6">
            <ProgressDashboard
              dailyEntries={userData.dailyEntries}
              totalImprovements={improvementItems.length}
            />
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-1 shadow-sm inline-flex">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'daily'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Target className="w-4 h-4" />
              מעקב יומי
            </button>
            <button
              onClick={() => setActiveTab('tables')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'tables'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Table className="w-4 h-4" />
              טבלאות נתונים
            </button>
          </div>
        </div>

        {activeTab === 'daily' ? (
          <>
            {/* Day Selector */}
            <div className="mb-6">
              <DaySelector
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                availableDates={availableDates}
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Improvements Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">לשיפור</h2>
                </div>
                
                <AddImprovementForm onAdd={addImprovement} type="improvement" />
                
                {improvementItems.length === 0 ? (
                  <div className="text-center py-8 bg-blue-50/50 backdrop-blur rounded-xl border border-blue-200/50">
                    <Target className="w-12 h-12 text-blue-300 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-blue-700 mb-2">
                      אין עדיין תחומי שיפור
                    </h3>
                    <p className="text-blue-600 text-sm">
                      התחל בהוספת התחום הראשון לשיפור
                    </p>
                  </div>
                ) : (
                  improvementItems.map((improvement) => (
                    <ImprovementCard
                      key={improvement.id}
                      improvement={improvement}
                      dailyData={currentEntry?.improvements[improvement.id]}
                      onUpdate={(data) => updateDailyEntry(improvement.id, data)}
                      onEdit={(text) => updateImprovement(improvement.id, text)}
                      onDelete={() => deleteImprovement(improvement.id)}
                    />
                  ))
                )}
              </div>

              {/* Preservation Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-800">לשימור</h2>
                </div>
                
                <AddImprovementForm onAdd={addImprovement} type="preservation" />
                
                {preservationItems.length === 0 ? (
                  <div className="text-center py-8 bg-green-50/50 backdrop-blur rounded-xl border border-green-200/50">
                    <Shield className="w-12 h-12 text-green-300 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-green-700 mb-2">
                      אין עדיין תחומי שימור
                    </h3>
                    <p className="text-green-600 text-sm">
                      התחל בהוספת התחום הראשון לשימור
                    </p>
                  </div>
                ) : (
                  preservationItems.map((improvement) => (
                    <ImprovementCard
                      key={improvement.id}
                      improvement={improvement}
                      dailyData={currentEntry?.improvements[improvement.id]}
                      onUpdate={(data) => updateDailyEntry(improvement.id, data)}
                      onEdit={(text) => updateImprovement(improvement.id, text)}
                      onDelete={() => deleteImprovement(improvement.id)}
                    />
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          /* Tables View */
          <div className="space-y-6">
            <ImprovementTable
              improvements={improvementItems}
              dailyEntries={userData.dailyEntries}
              type="improvement"
            />
            <ImprovementTable
              improvements={preservationItems}
              dailyEntries={userData.dailyEntries}
              type="preservation"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;