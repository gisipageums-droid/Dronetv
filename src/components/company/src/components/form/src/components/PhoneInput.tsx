import React, { useState, useEffect } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

interface Country {
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  cca3: string;
  idd: {
    root: string;
    suffixes: string[];
  };
}

interface PhoneInputProps {
  label: string;
  value: string; // This will now contain the full phone number with country code
  onChange: (value: string) => void; // This will now pass the combined phone number
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
  placeholder = "Enter phone number",
  className = '',
  onFocus,
  disabled = false,
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCountryCode, setCurrentCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Fetch countries data from API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,cca3,flags,idd');
        const data: Country[] = await response.json();
        
        // Filter countries that have IDD codes and sort by common name
        const validCountries = data
          .filter(country => country.idd && country.idd.root && country.idd.suffixes)
          .sort((a, b) => a.name.common.localeCompare(b.name.common));
        
        setCountries(validCountries);
        
        // Set default country code to India
        const india = validCountries.find(country => country.cca2 === 'IN');
        if (india) {
          const indiaCode = india.idd.root + india.idd.suffixes[0];
          setCurrentCountryCode(indiaCode);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Parse existing value to extract country code and phone number
  useEffect(() => {
    if (value && countries.length > 0) {
      // Find matching country code in the value
      let foundCountryCode = '+91'; // default
      let foundPhoneNumber = value;
      
      for (const country of countries) {
        const countryCode = getFullCountryCode(country);
        if (value.startsWith(countryCode)) {
          foundCountryCode = countryCode;
          foundPhoneNumber = value.substring(countryCode.length);
          break;
        }
      }
      
      setCurrentCountryCode(foundCountryCode);
      setPhoneNumber(foundPhoneNumber);
    } else if (!value) {
      setPhoneNumber('');
    }
  }, [value, countries]);

  // Get full country code (root + suffix)
  const getFullCountryCode = (country: Country): string => {
    return country.idd.root + (country.idd.suffixes[0] || '');
  };

  // Find selected country
  const selectedCountry = countries.find(country => 
    getFullCountryCode(country) === currentCountryCode
  );

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getFullCountryCode(country).includes(searchTerm)
  );

  const handleCountrySelect = (country: Country) => {
    const fullCode = getFullCountryCode(country);
    setCurrentCountryCode(fullCode);
    setIsDropdownOpen(false);
    setSearchTerm('');
    // Update the combined value
    onChange(fullCode + phoneNumber);
  };

  const handlePhoneNumberChange = (newPhoneNumber: string) => {
    setPhoneNumber(newPhoneNumber);
    // Update the combined value
    onChange(currentCountryCode + newPhoneNumber);
  };

  const inputClasses = `flex-1 px-3 py-2 border-0 rounded-r-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
    error
      ? 'bg-red-50'
      : 'bg-white'
  } ${className}`;

  const containerClasses = `flex border rounded-md transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent ${
    error
      ? 'border-red-300 bg-red-50'
      : 'border-amber-300 bg-white hover:border-amber-400'
  }`;

  return (
    <div className="mb-2">
      <label className="block text-xs font-semibold text-gray-700 mt-1 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className={containerClasses}>
        {/* Country Code Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={disabled || loading}
            className={`flex items-center px-3 py-2 border-r border-amber-300 bg-gray-50 rounded-l-md hover:bg-gray-100 transition-colors min-w-[120px] ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-2"></div>
                <span className="text-xs">Loading...</span>
              </div>
            ) : selectedCountry ? (
              <div className="flex items-center">
                <img
                  src={selectedCountry.flags.png}
                  alt={selectedCountry.flags.alt || `${selectedCountry.name.common} flag`}
                  className="w-4 h-3 mr-2 object-cover rounded-sm"
                />
                <span className="text-xs font-medium">{getFullCountryCode(selectedCountry)}</span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </div>
            ) : (
              <div className="flex items-center">
                <span className="text-xs text-gray-500">Select</span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </div>
            )}
          </button>

          {/* Dropdown */}
          {isDropdownOpen && !loading && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
              {/* Search Input */}
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              
              {/* Countries List */}
              <div className="overflow-y-auto max-h-48">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.cca2}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={country.flags.png}
                        alt={country.flags.alt || `${country.name.common} flag`}
                        className="w-4 h-3 mr-3 object-cover rounded-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-900 truncate">
                          {country.name.common}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 ml-2">
                        {getFullCountryCode(country)}
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

        {/* Phone Number Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => handlePhoneNumberChange(e.target.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
        />
      </div>
      
      {error && (
        <div className="flex items-center mt-1 text-red-600">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-xs">{error}</span>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};
