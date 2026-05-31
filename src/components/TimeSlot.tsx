import React from 'react';

interface TimeSlotProps {
  time: string;
  available: boolean;
  selected: boolean;
  onClick: () => void;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({ time, available, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={!available}
      className={`
        px-4 py-3 rounded-lg font-medium transition-all duration-200
        ${!available 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : selected 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50'
        }
      `}
    >
      {time}
    </button>
  );
};
