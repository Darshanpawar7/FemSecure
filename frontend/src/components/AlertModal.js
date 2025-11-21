import React from 'react';
import { X } from 'lucide-react';

const AlertModal = ({ isOpen, onClose, title, content, type = 'SOS' }) => {
  if (!isOpen) return null;

  const titleColor = type === 'SOS' || type === 'TIMER_EXPIRED' 
    ? 'text-red-500' 
    : type === 'SAFE' 
    ? 'text-green-500' 
    : 'text-pink-500';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 text-gray-200 rounded-xl shadow-2xl w-full max-w-md transform transition-all p-6 relative">
        <h3 className={`text-xl font-bold ${titleColor} border-b border-gray-700 pb-2 mb-4`}>
          {title}
        </h3>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-pink-500 transition"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};

export default AlertModal;