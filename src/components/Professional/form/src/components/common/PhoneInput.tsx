import { useState, useEffect } from "react";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export const PhoneInput = ({
  value,
  onChange,
  placeholder = "Enter phone number",
  required = false,
  className = "",
  disabled = false,
}: PhoneInputProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (value) {
      const num = value.startsWith("+91") ? value.slice(3) : value;
      setPhoneNumber(num);
    }
  }, []);

  const handleChange = (num: string) => {
    const digits = num.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(digits);
    onChange("+91" + digits);
  };

  const baseClasses =
    "border border-brand-yellow-soft rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow transition text-sm";

  return (
    <div className={`flex ${baseClasses} ${className}`}>
      <span className="flex items-center px-3 py-2 border-r border-brand-yellow-soft bg-surface-main text-sm font-medium text-ink-paragraph select-none">
        +91
      </span>
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={10}
        className="flex-1 px-3 py-2 focus:outline-none rounded-r-lg text-ink bg-surface-card disabled:opacity-60"
      />
    </div>
  );
};
