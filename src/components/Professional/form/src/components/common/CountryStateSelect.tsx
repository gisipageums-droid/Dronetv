import React, { useState, useEffect, useRef } from "react";
import { Country, State } from "country-state-city";
import { AlertCircle, ChevronDown } from "lucide-react";

interface CountryStateSelectProps {
  countryLabel?: string;
  stateLabel?: string;
  countryValue: string;
  stateValue: string;
  onCountryChange: (value: string) => void;
  onStateChange: (value: string) => void;
  countryRequired?: boolean;
  stateRequired?: boolean;
  countryError?: string;
  stateError?: string;
  countryPlaceholder?: string;
  statePlaceholder?: string;
  className?: string;
}

export const CountryStateSelect: React.FC<CountryStateSelectProps> = ({
  countryLabel = "Country",
  stateLabel = "State",
  countryValue,
  stateValue,
  onCountryChange,
  onStateChange,
  countryRequired = false,
  stateRequired = false,
  countryError,
  stateError,
  countryPlaceholder = "Select Country",
  statePlaceholder = "Select State",
  className = "",
}) => {
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [stateSearchTerm, setStateSearchTerm] = useState("");
  const [availableStates, setAvailableStates] = useState<any[]>([]);

  // Refs for detecting clicks outside
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const stateDropdownRef = useRef<HTMLDivElement>(null);

  // Get all countries from the package
  const allCountries = Country.getAllCountries();

  // Debug: Log when props change
  useEffect(() => {
    console.log("CountryStateSelect - Props updated:", {
      countryValue,
      stateValue,
      onCountryChange: typeof onCountryChange,
      onStateChange: typeof onStateChange
    });
  }, [countryValue, stateValue, onCountryChange, onStateChange]);

  // Update states when country changes
  useEffect(() => {
    if (countryValue) {
      // Find the country by name to get its isoCode
      const country = allCountries.find((c) => c.name === countryValue);
      
      if (country) {
        const states = State.getStatesOfCountry(country.isoCode);
        setAvailableStates(states);
        console.log(`Loaded ${states.length} states for ${countryValue}`);
      } else {
        setAvailableStates([]);
      }
    } else {
      setAvailableStates([]);
    }
  }, [countryValue, allCountries]);

  // Filter countries based on search term
  const filteredCountries = allCountries.filter((country) =>
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  // Filter states based on search term
  const filteredStates = availableStates.filter((state) =>
    state.name.toLowerCase().includes(stateSearchTerm.toLowerCase())
  );

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setCountryDropdownOpen(false);
        setCountrySearchTerm("");
      }
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target as Node)) {
        setStateDropdownOpen(false);
        setStateSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCountrySelect = (country: any) => {
    console.log("🟢 Country selected:", country.name);
    console.log("🟢 Calling onCountryChange with:", country.name);
    
    // Call the parent's onChange handler
    onCountryChange(country.name);
    
    setCountryDropdownOpen(false);
    setCountrySearchTerm("");
    // Clear state when country changes
    onStateChange("");
  };

  const handleStateSelect = (state: any) => {
    console.log("🟢 State selected:", state.name);
    console.log("🟢 Calling onStateChange with:", state.name);
    
    onStateChange(state.name);
    setStateDropdownOpen(false);
    setStateSearchTerm("");
  };

  const selectClasses = `w-full px-3 py-2 border rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm ${className}`;

  const getSelectClasses = (error?: string) =>
    `${selectClasses} ${
      error
        ? "border-red-300 bg-red-50"
        : "border-amber-300 bg-white hover:border-amber-400"
    }`;

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {/* Country Select */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-slate-800 mb-1">
          {countryLabel}
          {countryRequired && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="relative" ref={countryDropdownRef}>
          <button
            type="button"
            onClick={() => {
              console.log("🟡 Country dropdown clicked");
              setCountryDropdownOpen(!countryDropdownOpen);
              setStateDropdownOpen(false); // Close state dropdown
            }}
            className={`${getSelectClasses(
              countryError
            )} flex items-center justify-between text-left cursor-pointer w-full`}
          >
            <span className={countryValue ? "text-gray-900" : "text-gray-500"}>
              {countryValue || countryPlaceholder}
            </span>
            <ChevronDown 
              className={`w-4 h-4 transition-transform ${
                countryDropdownOpen ? "transform rotate-180" : ""
              }`}
            />
          </button>

          {/* Country Dropdown */}
          {countryDropdownOpen && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-amber-300 rounded-md shadow-lg max-h-60 overflow-hidden">
              {/* Search Input */}
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={countrySearchTerm}
                  onChange={(e) => setCountrySearchTerm(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-amber-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-400"
                  autoFocus
                />
              </div>

              {/* Countries List */}
              <div className="overflow-y-auto max-h-48">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.isoCode}
                      type="button"
                      onClick={() => {
                        console.log("🔵 Country button clicked:", country.name);
                        handleCountrySelect(country);
                      }}
                      className="w-full flex items-center px-3 py-2 text-left hover:bg-amber-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {country.name}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 ml-2">
                        {country.isoCode}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500 text-center">
                    No countries found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {countryError && (
          <div className="flex items-center mt-1 text-red-600">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span className="text-sm">{countryError}</span>
          </div>
        )}
      </div>

      {/* State Select */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-slate-800 mb-1">
          {stateLabel}
          {stateRequired && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="relative" ref={stateDropdownRef}>
          <button
            type="button"
            onClick={() => {
              if (countryValue) {
                setStateDropdownOpen(!stateDropdownOpen);
                setCountryDropdownOpen(false); // Close country dropdown
              }
            }}
            disabled={!countryValue}
            className={`${getSelectClasses(
              stateError
            )} flex items-center justify-between text-left w-full ${
              !countryValue ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {!countryValue ? (
              <span className="text-gray-400">Select country first</span>
            ) : (
              <span className={stateValue ? "text-gray-900" : "text-gray-500"}>
                {stateValue || statePlaceholder}
              </span>
            )}
            <ChevronDown 
              className={`w-4 h-4 transition-transform ${
                stateDropdownOpen ? "transform rotate-180" : ""
              }`}
            />
          </button>

          {/* State Dropdown */}
          {stateDropdownOpen && countryValue && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-amber-300 rounded-md shadow-lg max-h-60 overflow-hidden">
              {/* Search Input */}
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search states..."
                  value={stateSearchTerm}
                  onChange={(e) => setStateSearchTerm(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-amber-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-400"
                  autoFocus
                />
              </div>

              {/* States List */}
              <div className="overflow-y-auto max-h-48">
                {filteredStates.length > 0 ? (
                  filteredStates.map((state) => (
                    <button
                      key={state.isoCode}
                      type="button"
                      onClick={() => handleStateSelect(state)}
                      className="w-full flex items-center px-3 py-2 text-left hover:bg-amber-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {state.name}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 ml-2">
                        {state.isoCode}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500 text-center">
                    {availableStates.length === 0
                      ? "No states available for this country"
                      : "No states found"}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {stateError && (
          <div className="flex items-center mt-1 text-red-600">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span className="text-sm">{stateError}</span>
          </div>
        )}
      </div>
    </div>
  );
};