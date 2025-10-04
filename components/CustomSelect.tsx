import React, { useState, useRef, useEffect } from 'react';

// Define the shape of each option
export interface SelectOption {
  value: string;
  icon: React.ReactNode;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, ariaLabel, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(option => option.value === value);

  // Handle clicks outside the component to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (newValue: string) => {
    onChange(newValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className || ''}`} ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white/5 border border-white/10 backdrop-blur-lg p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF00EE]/50 hover:bg-white/10 active:bg-white/5 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        <span className="flex items-center gap-3">
          {selectedOption?.icon}
          {selectedOption?.value}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <ul
          className="absolute z-20 w-full mt-2 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg max-h-60 overflow-y-auto no-scrollbar animate-fade-in-up-fast"
          role="listbox"
        >
          {options.map(option => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/10 transition-colors"
              role="option"
              aria-selected={value === option.value}
            >
              {option.icon}
              <span>{option.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;