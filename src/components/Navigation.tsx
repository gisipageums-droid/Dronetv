import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { useUserAuth } from './context/context';
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { isLogin } = useUserAuth();
  
  const languageRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Companies', path: '/listed-companies' },
    { name: 'Products', path: '/products' },
    { name: 'Services', path: '/services' },
    { name: 'Professionals', path: '/professionals' },
    { name: 'Partner with us', path: '/partner' },
    //{ name: 'News', path: '/news' },
    { name: 'Videos', path: '/videos' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
    { name: isLogin ? 'Logout' : 'Login', path: isLogin ? '/logout' : '/login' }
    
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${isScrolled
      ? 'bg-yellow-400/95 backdrop-blur-lg shadow-2xl border-b border-yellow-500/20'
      : 'bg-yellow-400'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 group">
            <img
              src="/images/Drone tv .in.png"
              alt="Drone TV Logo"
              className="w-[5.5rem] h-[5.5rem] mx-auto cursor-pointer group-hover:scale-110 transition-all duration-300"
              onClick={() => handleNavigation('/')}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group overflow-hidden whitespace-nowrap ${location.pathname === item.path
                  ? 'text-gray-800 bg-black/10'
                  : 'text-black hover:text-gray-800'
                  }`}
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-black/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg"></div>
              </Link>
            ))}

            {/* Language Selector */}
            <div className="relative" ref={languageRef}>
              <button onClick={() => setIsLanguageOpen(!isLanguageOpen)} className="text-black hover:text-gray-800 flex items-center space-x-2">
                <img src="/images/iconre.jpg" alt="Language" className="h-6 w-6 rounded-full" />
                <span className="text-sm">Language</span>
              </button>
              {isLanguageOpen && (
                <div className="absolute right-0 bg-yellow-300 border-2 border-yellow-400 rounded-lg shadow-lg mt-2 z-50">
                  <div className="p-2">
                    <ul className="text-sm text-black">
                      {[
                        'English', 'Hindi', 'Bengali', 'Telugu',
                        'Tamil', 'Kannada', 'Odia', 'Assamese',
                        'Nepali', 'Spanish', 'French', 'Chinese'
                      ].map(lang => (
                        <li
                          key={lang}
                          className="px-4 py-2 cursor-pointer hover:bg-yellow-200 rounded"
                        >
                          {lang}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="xl:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black hover:text-gray-800 focus:outline-none transition-all duration-300 hover:scale-110"
            >
              <div className="relative w-6 h-6">
                <Menu className={`h-6 w-6 absolute transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}`} />
                <X className={`h-6 w-6 absolute transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`xl:hidden transition-all duration-500 ease-out overflow-hidden ${isMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}`}>
          {/* Scrolling is inside this div */}
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-yellow-400 max-h-[70vh] overflow-y-auto rounded-b-2xl">
            {navItems.map((item, index) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:bg-black/10 transform hover:translate-x-2 ${location.pathname === item.path
                  ? 'text-gray-800 bg-black/10'
                  : 'text-black hover:text-gray-800'
                  }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  transform: isMenuOpen ? 'translateY(0)' : 'translateY(-20px)',
                  opacity: isMenuOpen ? 1 : 0,
                  transition: `all 0.3s ease-out ${index * 50}ms`
                }}
              >
                {item.name}
              </button>
            ))}
            <div className="px-3 py-2">
              <Search className="h-5 w-5 text-black hover:text-gray-800 cursor-pointer transition-all duration-300 hover:scale-125" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
