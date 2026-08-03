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
      <label className="block text-xs font-semibold text-ink-paragraph mb-1">
        {label}
        {required && <span className="text-status-error ml-1">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows || 4}
          disabled={disabled}
          required={required}
          className={`w-full px-3 py-2 border rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-status-info focus:border-transparent text-sm ${error
            ? 'border-status-error/40 bg-status-error/10'
            : 'border-brand-yellow-soft bg-surface-card hover:border-brand-yellow'
            } ${disabled ? 'bg-ink-light cursor-not-allowed' : ''} ${className}`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full px-3 py-2 border rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-status-info focus:border-transparent text-sm ${error
            ? 'border-status-error/40 bg-status-error/10'
            : 'border-brand-yellow-soft bg-surface-card hover:border-brand-yellow'
            } ${disabled ? 'bg-ink-light cursor-not-allowed' : ''} ${className}`}
        />
      )}

      {error && (
        <div className="flex items-center mt-1 text-status-error">
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
  const selectClasses = `w-full px-3 py-2 border rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-status-info focus:border-transparent text-sm ${error
    ? 'border-status-error/40 bg-status-error/10'
    : 'border-brand-yellow-soft bg-surface-card hover:border-brand-yellow'
    } ${className}`;

  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-ink-paragraph mb-1">
        {label}
        {required && <span className="text-status-error ml-1">*</span>}

      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
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
        <div className="flex items-center mt-1 text-status-error">
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
      <label className="block text-xs font-semibold text-ink-paragraph mb-2">
        {label}
        {required && <span className="text-status-error ml-1">*</span>}
      </label>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={`flex items-center p-2 border rounded-md cursor-pointer transition-all hover:bg-ink-offwhite ${selected.includes(option)
              ? 'border-status-info bg-status-info/10 text-status-info'
              : 'border-ink-light'
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
                ? 'border-status-info bg-status-info'
                : 'border-ink-light'
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
              <h5 className="text-xs font-semibold text-ink-paragraph mb-1">
                Added Items:
              </h5>
              <div className="flex flex-wrap">
                {otherValue.split(',').map((item, index) => {
                  const trimmedItem = item.trim();
                  if (!trimmedItem) return null;
                  return (
                    <span
                      key={index}
                      className="inline-block px-2 py-0.5 mr-1 mb-1 bg-status-info/15 text-status-info rounded border border-status-info/25 text-xs font-medium"
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
        <div className="flex items-center mt-1 text-status-error">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-xs">{error}</span>
        </div>
      )}
    </div>
  );
};
