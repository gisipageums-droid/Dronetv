import { useState, useEffect, useRef } from "react";

interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  cca3: string;
  flags: {
    png: string;
    svg: string;
  };
  idd: {
    root: string;
    suffixes: string[];
  };
}

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
  className = ""
}: PhoneInputProps) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch countries from REST Countries API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,cca3,flags,idd");
        
        if (!response.ok) {
          throw new Error("Failed to fetch countries");
        }
        
        const data: Country[] = await response.json();
        
        // Filter countries that have IDD codes and sort by name
        const validCountries = data
          .filter(country => country.idd && country.idd.root)
          .sort((a, b) => a.name.common.localeCompare(b.name.common));
        
        setCountries(validCountries);
        
        // Set default to India if available
        const indiaCountry = validCountries.find(country => country.cca2 === "IN");
        if (indiaCountry && !selectedCountry) {
          setSelectedCountry(indiaCountry);
        }
        
        setError("");
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError("Failed to load countries");
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Parse existing value when component mounts or value changes
  useEffect(() => {
    if (value && countries.length > 0) {
      // Try to parse existing phone number with country code
      const match = value.match(/^(\+\d{1,4})(.*)$/);
      if (match) {
        const [, countryCode, number] = match;
        
        // Find country by matching IDD code
        const country = countries.find(c => {
          if (!c.idd || !c.idd.root || !c.idd.suffixes) return false;
          
          return c.idd.suffixes.some(suffix => {
            const fullCode = c.idd.root + suffix;
            return countryCode === fullCode;
          });
        });
        
        if (country) {
          setSelectedCountry(country);
          setPhoneNumber(number);
          return;
        }
      }
      
      // If no country code found, treat as phone number only
      setPhoneNumber(value);
    }
  }, [value, countries]);

  // Get full IDD code for selected country
  const getCountryCode = (country: Country): string => {
    if (!country.idd || !country.idd.root || !country.idd.suffixes || country.idd.suffixes.length === 0) {
      return "";
    }
    return country.idd.root + country.idd.suffixes[0];
  };

  // Handle phone number change
  const handlePhoneNumberChange = (newPhoneNumber: string) => {
    setPhoneNumber(newPhoneNumber);
    
    if (selectedCountry) {
      const countryCode = getCountryCode(selectedCountry);
      
      // Check if the phone number already starts with a country code
      if (newPhoneNumber.startsWith('+')) {
        // Phone number already has a country code, use as is
        onChange(newPhoneNumber);
      } else {
        // Add country code to phone number
        const fullNumber = countryCode + newPhoneNumber;
        onChange(fullNumber);
      }
    } else {
      onChange(newPhoneNumber);
    }
  };

  // Handle country selection
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchTerm("");
    
    const countryCode = getCountryCode(country);
    
    // Check if the phone number already starts with a country code
    if (phoneNumber.startsWith('+')) {
      // Phone number already has a country code, use as is
      onChange(phoneNumber);
    } else {
      // Add country code to phone number
      const fullNumber = countryCode + phoneNumber;
      onChange(fullNumber);
    }
  };

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.name.official.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCountryCode(country).includes(searchTerm)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isDropdownOpen]);

  const baseClasses = "border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm";

  if (loading) {
    return (
      <div className={`${baseClasses} p-2 ${className}`}>
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-400 mr-2"></div>
          <span className="text-gray-500">Loading countries...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${baseClasses} p-2 border-red-300 ${className}`}>
        <span className="text-red-500 text-sm">{error}</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className={`flex ${baseClasses} ${className}`}>
        {/* Country Code Selector */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center px-3 py-2 border-r border-amber-300 hover:bg-amber-50 focus:outline-none"
        >
          {selectedCountry ? (
            <>
              <img 
                src={selectedCountry.flags.png} 
                alt={selectedCountry.name.common}
                className="w-5 h-3 mr-2 object-cover rounded"
              />
              <span className="text-sm font-medium">
                {getCountryCode(selectedCountry)}
              </span>
            </>
          ) : (
            <span className="text-gray-500 text-sm">Select</span>
          )}
          <svg 
            className={`ml-1 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Phone Number Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => handlePhoneNumberChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="flex-1 px-3 py-2 focus:outline-none"
        />
      </div>

      {/* Country Dropdown */}
      {isDropdownOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-amber-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search countries..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
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
                  className="w-full px-3 py-2 text-left hover:bg-amber-50 focus:bg-amber-50 focus:outline-none flex items-center"
                >
                  <img 
                    src={country.flags.png} 
                    alt={country.name.common}
                    className="w-5 h-3 mr-3 object-cover rounded"
                  />
                  <span className="flex-1 text-sm">{country.name.common}</span>
                  <span className="text-sm font-medium text-gray-600 ml-2">
                    {getCountryCode(country)}
                  </span>
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
  );
};
