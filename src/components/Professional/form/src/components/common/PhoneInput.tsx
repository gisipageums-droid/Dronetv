import { useState, useEffect } from "react";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const PhoneInput = ({
  value,
  onChange,
  placeholder = "Enter phone number",
  required = false,
  className = "",
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
    "border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm";

  return (
    <div className={`flex ${baseClasses} ${className}`}>
      <span className="flex items-center px-3 py-2 border-r border-amber-300 bg-amber-50 text-sm font-medium text-gray-700 select-none">
        +91
      </span>
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        maxLength={10}
        className="flex-1 px-3 py-2 focus:outline-none rounded-r-lg"
      />
    </div>
  );
};
