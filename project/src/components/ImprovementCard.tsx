import React, { useState } from 'react';
import { Check, Edit2, Trash2, Target, Shield, Crown, Users } from 'lucide-react';
import { Improvement } from '../types';
import { StarRating } from './StarRating';

interface ImprovementCardProps {
  improvement: Improvement;
  dailyData?: {
    attempted?: boolean;
    effortLevel?: number;
    initiative?: string;
    content?: string;
  };
  onUpdate: (data: {
    attempted?: boolean;
    effortLevel?: number;
    initiative?: string;
    content?: string;
  }) => void;
  onEdit: (text: string) => void;
  onDelete: () => void;
}

export const ImprovementCard: React.FC<ImprovementCardProps> = ({
  improvement,
  dailyData = {},
  onUpdate,
  onEdit,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(improvement.text);

  const handleSaveEdit = () => {
    onEdit(editText);
    setIsEditing(false);
  };

  const updateData = (updates: Partial<typeof dailyData>) => {
    onUpdate({ ...dailyData, ...updates });
  };

  const cardColor = improvement.type === 'improvement' 
    ? 'from-blue-50 to-blue-100 border-blue-200' 
    : 'from-green-50 to-green-100 border-green-200';

  const iconColor = improvement.type === 'improvement' ? 'text-blue-600' : 'text-green-600';
  const Icon = improvement.type === 'improvement' ? Target : Shield;
  const SourceIcon = improvement.source === 'commander' ? Crown : Users;
  const sourceText = improvement.source === 'commander' ? 'מפקד' : 'חבר צוות';
  const sourceColor = improvement.source === 'commander' ? 'text-purple-600' : 'text-orange-600';

  return (
    <div className={`bg-gradient-to-br ${cardColor} border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          <Icon className={`w-4 h-4 ${iconColor}`} />
          <span className="text-xs uppercase tracking-wide font-medium text-gray-600">
            {improvement.type === 'improvement' ? 'לשיפור' : 'לשימור'}
          </span>
          <div className="flex items-center gap-1 mr-2">
            <SourceIcon className={`w-3 h-3 ${sourceColor}`} />
            <span className={`text-xs font-medium ${sourceColor}`}>
              {sourceText}
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 hover:bg-white/50 rounded"
          >
            <Edit2 className="w-3 h-3 text-gray-500" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 hover:bg-white/50 rounded"
          >
            <Trash2 className="w-3 h-3 text-red-500" />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-2 border rounded-lg resize-none text-right"
            rows={2}
            dir="rtl"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              שמור
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            >
              ביטול
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-800 mb-3 leading-relaxed text-right" dir="rtl">{improvement.text}</p>
          
          {improvement.type === 'improvement' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => updateData({ attempted: !dailyData.attempted })}
                  className={`w-7 h-7 rounded-full border-3 flex items-center justify-center transition-colors ${
                    dailyData.attempted
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-400 hover:border-green-400'
                  }`}
                >
                  {dailyData.attempted && <Check className="w-4 h-4 text-white font-bold" />}
                </button>
                <span className="text-sm font-medium text-gray-700 mr-2">ניסיתי היום</span>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1 text-right">
                  רמת מאמץ לשיפור (1-5)
                </label>
                <div className="flex justify-end">
                  <StarRating
                    rating={dailyData.effortLevel || 0}
                    onRatingChange={(rating) => updateData({ effortLevel: rating })}
                    size="sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1 text-right">
                  יוזמה לפיתוח החולשה
                </label>
                <textarea
                  value={dailyData.initiative || ''}
                  onChange={(e) => updateData({ initiative: e.target.value })}
                  placeholder="איזה פעולה ספציפית תעשה?"
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none text-right"
                  rows={2}
                  dir="rtl"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1 text-right">
                רשום משהו
              </label>
              <textarea
                value={dailyData.content || ''}
                onChange={(e) => updateData({ content: e.target.value })}
                placeholder="כתוב כאן..."
                className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none text-right"
                rows={3}
                dir="rtl"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};