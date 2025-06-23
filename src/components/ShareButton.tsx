import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';

interface ShareButtonProps {
  shareUrl: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ shareUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Share2 className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold text-gray-800">שתף את ההתקדמות שלך</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-3 text-right" dir="rtl">
        שתף את הקישור הזה עם אחרים כדי לאפשר להם לצפות במסע השיפור שלך (גישה לקריאה בלבד).
      </p>
      
      <div className="flex gap-2">
        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-2 text-sm text-gray-700 font-mono break-all">
          {shareUrl}
        </div>
        <button
          onClick={handleCopy}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            copied
              ? 'bg-green-100 text-green-700'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              הועתק!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              העתק
            </>
          )}
        </button>
      </div>
    </div>
  );
};