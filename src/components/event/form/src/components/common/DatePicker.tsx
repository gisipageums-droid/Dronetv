import React from 'react';

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label = "Date",
  value,
  onChange,
  required = false,
  placeholder = "Select date",
  className = '',
}) => {
  // ===== Date picker (custom dropdowns) =====
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  // Split current date (if exists)
  const [year, month, day] = value
    ? value.split("-")
    : ["", "", ""];

  // Handle dropdown changes
  const handleChange = (field: string, selectedValue: string) => {
    const newDate = {
      year: field === "year" ? selectedValue : year,
      month: field === "month" ? selectedValue : month,
      day: field === "day" ? selectedValue : day,
    };

    // Only update when at least year and month are selected
    const formattedDate = `${newDate.year || ""}-${newDate.month || ""}-${newDate.day || ""}`;
    onChange(formattedDate);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium text-slate-800">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="flex gap-2">
        {/* Day */}
        <select
          className="border border-amber-300 rounded-lg p-2 flex-1 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm"
          value={day || new Date().getDate().toString().padStart(2, "0")}
          onChange={(e) => handleChange("day", e.target.value)}
        >
          <option value="">Day</option>
          {days.map((d) => (
            <option key={d} value={String(d).padStart(2, "0")}>
              {d}
            </option>
          ))}
        </select>

        {/* Month */}
        <select
          className="border border-amber-300 rounded-lg p-2 flex-1 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm"
          value={month || String(new Date().getMonth() + 1).padStart(2, "0")}
          onChange={(e) => handleChange("month", e.target.value)}
        >
          <option value="">Month</option>
          {months.map((m, i) => (
            <option key={i} value={String(i + 1).padStart(2, "0")}>
              {m}
            </option>
          ))}
        </select>

        {/* Year */}
        <select
          className="border border-amber-300 rounded-lg p-2 flex-1 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm"
          value={year || new Date().getFullYear().toString()}
          onChange={(e) => handleChange("year", e.target.value)}
        >
          <option value="">Year</option>
          {years
            .slice()
            .reverse()
            .map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
        </select>
      </div>

      {/* ===== Contextual helper text ===== */}
      <p className="text-xs text-amber-700 mt-1">
        {(() => {
          const today = new Date();
          const selectedDate =
            year && month && day
              ? new Date(`${year}-${month}-${day}`)
              : new Date(); // Use current date as default

          const isToday =
            selectedDate.toDateString() === today.toDateString();
          const isThisMonth =
            selectedDate.getMonth() === today.getMonth() &&
            selectedDate.getFullYear() === today.getFullYear();
          const isThisYear =
            selectedDate.getFullYear() === today.getFullYear();

          if (isToday) return "📅 This is today's date.";
          if (isThisMonth) return "🗓 This month is ongoing.";
          if (isThisYear) return "📆 This year is currently ongoing.";
          return "📅 Default set to today's date";
        })()}
      </p>
    </div>
  );
};
