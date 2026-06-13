import React from 'react';
import { AlertCircle } from 'lucide-react';

interface PhoneInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
  onFocus?: () => void;
  disabled?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  error,
  placeholder = "Enter 10-digit number",
  className = '',
  onFocus,
  disabled = false,
}) => {
  const phoneNumber = value?.startsWith('+91') ? value.substring(3) : (value || '');

  const handlePhoneChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    onChange('+91' + digits);
  };

  const containerClasses = `flex border rounded-md transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent ${
    error ? 'border-red-300 bg-red-50' : 'border-amber-300 bg-white hover:border-amber-400'
  }`;

  const inputClasses = `flex-1 px-3 py-2 border-0 rounded-r-md text-gray-900 bg-white transition-all focus:outline-none text-sm ${
    error ? 'bg-red-50' : 'bg-white'
  } ${className}`;

  return (
    <div className="mb-2">
      <label className="block text-xs font-semibold text-gray-700 mt-1 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className={containerClasses}>
        {/* Fixed India prefix */}
        <div className="flex items-center px-3 py-2 border-r border-amber-300 bg-gray-50 rounded-l-md min-w-[80px] select-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className="w-5 h-3.5 mr-2 rounded-sm flex-shrink-0">
            <rect width="900" height="600" fill="#FF9933"/>
            <rect width="900" height="200" y="200" fill="white"/>
            <rect width="900" height="200" y="400" fill="#138808"/>
            <circle cx="450" cy="300" r="60" fill="none" stroke="#000080" strokeWidth="4"/>
            <circle cx="450" cy="300" r="8" fill="#000080"/>
            {Array.from({length: 24}).map((_, i) => {
              const angle = (i * 15 * Math.PI) / 180;
              return <line key={i} x1="450" y1="300" x2={450 + 56 * Math.cos(angle)} y2={300 + 56 * Math.sin(angle)} stroke="#000080" strokeWidth="2"/>;
            })}
          </svg>
          <span className="text-xs font-semibold text-gray-700">+91</span>
        </div>

        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => handlePhoneChange(e.target.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={10}
          className={inputClasses}
        />
      </div>

      {error && (
        <div className="flex items-center mt-1 text-red-600">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-xs">{error}</span>
        </div>
      )}
    </div>
  );
};
