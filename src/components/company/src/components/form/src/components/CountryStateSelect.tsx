import React, { useState, useEffect } from "react";
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
  const [selectedCountryCode, setSelectedCountryCode] = useState("");

  // Get all countries from the package
  const allCountries = Country.getAllCountries();

  // Get states for the selected country
  const [availableStates, setAvailableStates] = useState<any[]>([]);

  // Update states when country changes
  useEffect(() => {
    if (countryValue) {
      // Find the country by name to get its isoCode
      const country = allCountries.find((c) => c.name === countryValue);

      if (country) {
        setSelectedCountryCode(country.isoCode);
        const states = State.getStatesOfCountry(country.isoCode);
        setAvailableStates(states);
        console.log(`Loaded ${states.length} states for ${countryValue}`);
      } else {
        setAvailableStates([]);
        setSelectedCountryCode("");
      }
    } else {
      setAvailableStates([]);
      setSelectedCountryCode("");
    }
  }, [countryValue]);

  // Filter countries based on search term
  const filteredCountries = allCountries.filter((country) =>
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  // Filter states based on search term
  const filteredStates = availableStates.filter((state) =>
    state.name.toLowerCase().includes(stateSearchTerm.toLowerCase())
  );

  const handleCountrySelect = (country: any) => {
    console.log("Country selected:", country.name);
    onCountryChange(country.name);
    setCountryDropdownOpen(false);
    setCountrySearchTerm("");
    // Clear state when country changes
    onStateChange("");
  };

  const handleStateSelect = (state: any) => {
    console.log("State selected:", state.name);
    onStateChange(state.name);
    setStateDropdownOpen(false);
    setStateSearchTerm("");
  };

  const selectClasses = `w-full px-3 py-2 border rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${className}`;

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
        <label className="block text-xs font-semibold text-gray-700 mt-1 mb-1">
          {countryLabel}
          {countryRequired && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="relative">
          <button
            type="button"
            onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
            className={`${getSelectClasses(
              countryError
            )} flex items-center justify-between text-left cursor-pointer`}
          >
            <span className={countryValue ? "text-gray-900" : "text-gray-500"}>
              {countryValue || countryPlaceholder}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Country Dropdown */}
          {countryDropdownOpen && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
              {/* Search Input */}
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={countrySearchTerm}
                  onChange={(e) => setCountrySearchTerm(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                      onClick={() => handleCountrySelect(country)}
                      className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-900 truncate">
                          {country.name}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 ml-2">
                        {country.isoCode}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-xs text-gray-500">
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
            <span className="text-xs">{countryError}</span>
          </div>
        )}
      </div>

      {/* State Select */}
      <div className="mb-2">
        <label className="block text-xs font-semibold text-gray-700 mt-1 mb-1">
          {stateLabel}
          {stateRequired && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="relative">
          <button
            type="button"
            onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
            disabled={!countryValue}
            className={`${getSelectClasses(
              stateError
            )} flex items-center justify-between text-left ${
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
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* State Dropdown */}
          {stateDropdownOpen && countryValue && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
              {/* Search Input */}
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search states..."
                  value={stateSearchTerm}
                  onChange={(e) => setStateSearchTerm(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                      className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-900 truncate">
                          {state.name}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 ml-2">
                        {state.isoCode}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-xs text-gray-500">
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
            <span className="text-xs">{stateError}</span>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(countryDropdownOpen || stateDropdownOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setCountryDropdownOpen(false);
            setStateDropdownOpen(false);
          }}
        />
      )}
    </div>
  );
};
