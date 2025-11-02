
import React from 'react';
import type { Option } from '../types';

interface OptionSelectorProps {
  title: string;
  options: Option[];
  selectedOption: Option;
  onSelect: (option: Option) => void;
  icon: React.ReactNode;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({ title, options, selectedOption, onSelect, icon }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-pink-600">
        {icon}
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option)}
            className={`px-4 py-2 text-sm rounded-full border-2 transition-all duration-300
              ${selectedOption.id === option.id 
                ? 'bg-pink-500 border-pink-500 text-white font-bold shadow-lg' 
                : 'bg-pink-100/50 border-pink-200 text-pink-800 hover:bg-pink-500 hover:border-pink-400 hover:text-white'
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OptionSelector;