import React, { useState } from 'react';
import { Plus, Target, Shield, Crown, Users } from 'lucide-react';
import { Improvement } from '../types';

interface AddImprovementFormProps {
  onAdd: (improvement: Omit<Improvement, 'id' | 'createdAt'>) => void;
  type: 'improvement' | 'preservation';
}

export const AddImprovementForm: React.FC<AddImprovementFormProps> = ({ onAdd, type }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [source, setSource] = useState<'commander' | 'team'>('commander');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd({ text: text.trim(), type, source });
      setText('');
      setIsOpen(false);
    }
  };

  const buttonText = type === 'improvement' ? 'הוסף לשיפור' : 'הוסף לשימור';
  const placeholderText = type === 'improvement' ? 'תאר את תחום השיפור...' : 'תאר את מה שצריך לשמר...';
  const Icon = type === 'improvement' ? Target : Shield;
  const colorClass = type === 'improvement' ? 'text-blue-600 hover:text-blue-700' : 'text-green-600 hover:text-green-700';
  const bgClass = type === 'improvement' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700';

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-current transition-colors flex items-center justify-center gap-2 ${colorClass}`}
      >
        <Plus className="w-5 h-5" />
        <Icon className="w-5 h-5" />
        {buttonText}
      </button>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
            מקור השיפור
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSource('team')}
              className={`flex-1 p-3 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                source === 'team'
                  ? 'bg-orange-50 border-orange-200 text-orange-700'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4" />
              חבר צוות
            </button>
            <button
              type="button"
              onClick={() => setSource('commander')}
              className={`flex-1 p-3 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                source === 'commander'
                  ? 'bg-purple-50 border-purple-200 text-purple-700'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Crown className="w-4 h-4" />
              מפקד
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
            תיאור
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholderText}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
            rows={3}
            required
            dir="rtl"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className={`flex-1 ${bgClass} text-white py-2 px-4 rounded-lg transition-colors font-medium`}
          >
            הוסף
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setText('');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ביטול
          </button>
        </div>
      </form>
    </div>
  );
};