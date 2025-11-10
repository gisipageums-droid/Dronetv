import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

interface Country {
  iso2: string;
  iso3: string;
  country: string;
  cities: string[];
}

interface State {
  name: string;
  state_code: string;
}

interface CountriesApiResponse {
  error: boolean;
  msg: string;
  data: Country[];
}

interface StatesApiResponse {
  error: boolean;
  msg: string;
  data: {
    name: string;
    iso3: string;
    iso2: string;
    states: State[];
  };
}

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
  className = '',
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [stateSearchTerm, setStateSearchTerm] = useState('');
  const previousCountryRef = useRef<string>('');

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        const response = await fetch('https://countriesnow.space/api/v0.1/countries');
        const data: CountriesApiResponse = await response.json();
        
        if (!data.error && data.data) {
          // Sort countries alphabetically
          const sortedCountries = data.data.sort((a, b) => a.country.localeCompare(b.country));
          setCountries(sortedCountries);
        } else {
          console.error('Error fetching countries:', data.msg);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    const fetchStates = async () => {
      if (!countryValue) {
        setStates([]);
        return;
      }

      try {
        setLoadingStates(true);
        console.log('Fetching states for country:', countryValue);
        
        // Test with a few known variations to handle case sensitivity
        const countryVariations = [
          countryValue,
          countryValue.toLowerCase(),
          countryValue.charAt(0).toUpperCase() + countryValue.slice(1).toLowerCase()
        ];
        
        let statesData = null;
        let lastError = null;
        
        // Try different country name formats
        for (const countryName of countryVariations) {
          try {
            console.log('Trying country name:', countryName);
            const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                country: countryName
              }),
            });
            
            const data: StatesApiResponse = await response.json();
            console.log('States API response for', countryName, ':', data);
            
            if (!data.error && data.data && data.data.states && data.data.states.length > 0) {
              statesData = data;
              break;
            } else {
              lastError = data.msg || 'No states found';
            }
          } catch (err) {
            lastError = err;
            console.error('Error trying country name', countryName, ':', err);
          }
        }
        
        if (statesData && statesData.data && statesData.data.states) {
          // Sort states alphabetically
          const sortedStates = statesData.data.states.sort((a, b) => a.name.localeCompare(b.name));
          setStates(sortedStates);
          console.log('States loaded:', sortedStates.length);
        } else {
          console.error('Error fetching states after trying all variations:', lastError);
          setStates([]);
        }
      } catch (error) {
        console.error('Error fetching states:', error);
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    };

    // Only fetch states when country changes, not when state changes
    if (previousCountryRef.current !== countryValue) {
      fetchStates();
      // Clear state value when country changes
      if (stateValue && previousCountryRef.current) {
        onStateChange('');
      }
      previousCountryRef.current = countryValue;
    }
  }, [countryValue, stateValue, onStateChange]);

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.country.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  // Filter states based on search term
  const filteredStates = states.filter(state =>
    state.name.toLowerCase().includes(stateSearchTerm.toLowerCase())
  );

  const handleCountrySelect = (country: Country) => {
    console.log('Country selected:', country.country);
    onCountryChange(country.country);
    setCountryDropdownOpen(false);
    setCountrySearchTerm('');
  };

  const handleStateSelect = (state: State) => {
    onStateChange(state.name);
    setStateDropdownOpen(false);
    setStateSearchTerm('');
  };

  const selectClasses = `w-full px-3 py-2 border rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm ${className}`;

  const getSelectClasses = (error?: string) => `${selectClasses} ${
    error
      ? 'border-red-300 bg-red-50'
      : 'border-amber-300 bg-white hover:border-amber-400'
  }`;

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {/* Country Select */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-slate-800 mb-1">
          {countryLabel}
          {countryRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="relative">
          <button
            type="button"
            onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
            disabled={loadingCountries}
            className={`${getSelectClasses(countryError)} flex items-center justify-between ${
              loadingCountries ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {loadingCountries ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-amber-600 rounded-full animate-spin mr-2"></div>
                <span>Loading countries...</span>
              </div>
            ) : (
              <span className={countryValue ? 'text-gray-900' : 'text-gray-500'}>
                {countryValue || countryPlaceholder}
              </span>
            )}
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Country Dropdown */}
          {countryDropdownOpen && !loadingCountries && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-amber-300 rounded-md shadow-lg max-h-60 overflow-hidden">
              {/* Search Input */}
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={countrySearchTerm}
                  onChange={(e) => setCountrySearchTerm(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-amber-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
              
              {/* Countries List */}
              <div className="overflow-y-auto max-h-48">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.iso2}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="w-full flex items-center px-3 py-2 text-left hover:bg-amber-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {country.country}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 ml-2">
                        {country.iso2}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
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
        
        <div className="relative">
          <button
            type="button"
            onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
            disabled={loadingStates || !countryValue}
            className={`${getSelectClasses(stateError)} flex items-center justify-between ${
              loadingStates || !countryValue ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {loadingStates ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-amber-600 rounded-full animate-spin mr-2"></div>
                <span>Loading states...</span>
              </div>
            ) : !countryValue ? (
              <span className="text-gray-400">Select country first</span>
            ) : (
              <span className={stateValue ? 'text-gray-900' : 'text-gray-500'}>
                {stateValue || statePlaceholder}
              </span>
            )}
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* State Dropdown */}
          {stateDropdownOpen && !loadingStates && countryValue && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-amber-300 rounded-md shadow-lg max-h-60 overflow-hidden">
              {/* Search Input */}
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search states..."
                  value={stateSearchTerm}
                  onChange={(e) => setStateSearchTerm(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-amber-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
              
              {/* States List */}
              <div className="overflow-y-auto max-h-48">
                {filteredStates.length > 0 ? (
                  filteredStates.map((state) => (
                    <button
                      key={state.state_code}
                      type="button"
                      onClick={() => handleStateSelect(state)}
                      className="w-full flex items-center px-3 py-2 text-left hover:bg-amber-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {state.name}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 ml-2">
                        {state.state_code}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No states found
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
