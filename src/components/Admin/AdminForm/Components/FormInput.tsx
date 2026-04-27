import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormInputProps {
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
  rows?: number;
  disabled?: boolean;
  id?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  error,
  placeholder,
  className = '',
  rows,
  disabled = false,
  id,
}) => {
  return (
    <div className="mb-2">
      <label className="block text-xs font-semibold text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows || 4}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${error
            ? 'border-red-300 bg-red-50'
            : 'border-amber-300 bg-white hover:border-amber-400'
            } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${error
            ? 'border-red-300 bg-red-50'
            : 'border-amber-300 bg-white hover:border-amber-400'
            } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
        />
      )}

      {error && (
        <div className="flex items-center mt-1 text-red-600">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-xs">{error}</span>
        </div>
      )}
    </div>
  );
};

interface SelectProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  required = false,
  error,
  placeholder = 'Select an option',
  className = '',
}) => {
  const selectClasses = `w-full px-3 py-2 border rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${error
    ? 'border-red-300 bg-red-50'
    : 'border-amber-300 bg-white hover:border-amber-400'
    } ${className}`;

  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}

      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectClasses}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <div className="flex items-center mt-1 text-red-600">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-xs">{error}</span>
        </div>
      )}
    </div>
  );
};

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  required?: boolean;
  error?: string;
  showOther?: boolean;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selected,
  onChange,
  required = false,
  error,
  showOther = false,
  otherValue = '',
  onOtherChange,
}) => {
  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-slate-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={`flex items-center p-2 border rounded-md cursor-pointer transition-all hover:bg-slate-50 ${selected.includes(option)
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-slate-300'
              }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => handleToggle(option)}
              className="sr-only"
            />
            <div
              className={`w-3 h-3 rounded border-2 mr-2 flex items-center justify-center ${selected.includes(option)
                ? 'border-blue-500 bg-blue-500'
                : 'border-slate-300'
                }`}
            >
              {selected.includes(option) && (
                <svg
                  className="w-2 h-2 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span className="text-xs font-medium">{option}</span>
          </label>
        ))}
      </div>

      {showOther && selected.includes('Other') && (
        <div className="mt-2">
          <FormInput
            label="Please specify other options (comma-separated)"
            value={otherValue}
            onChange={onOtherChange || (() => { })}
            placeholder="Enter other options..."
          />
          {otherValue && otherValue.trim() && (
            <div className="mt-3">
              <h5 className="text-xs font-semibold text-slate-700 mb-1">
                Added Items:
              </h5>
              <div className="flex flex-wrap">
                {otherValue.split(',').map((item, index) => {
                  const trimmedItem = item.trim();
                  if (!trimmedItem) return null;
                  return (
                    <span
                      key={index}
                      className="inline-block px-2 py-0.5 mr-1 mb-1 bg-blue-100 text-blue-800 rounded border border-blue-200 text-xs font-medium"
                    >
                      {trimmedItem}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center mt-1 text-red-600">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-xs">{error}</span>
        </div>
      )}
    </div>
  );
};
