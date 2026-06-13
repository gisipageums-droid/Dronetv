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
        {/* Fixed India +91 prefix */}
        <div className="flex items-center px-3 py-2 border-r border-amber-300 bg-gray-50 rounded-l-md select-none">
          <span className="text-sm font-semibold text-gray-700">+91</span>
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
