// import React, { useState, useEffect } from 'react';
// import { Menu, X } from 'lucide-react';

// const Navigation: React.FC = () => {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 50);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const navItems = [
//     { name: 'Home', href: '#home' },
//     { name: 'Highlights', href: '#highlights' },
//     { name: 'Speakers', href: '#speakers' },
//     { name: 'Schedule', href: '#schedule' },
//     { name: 'Exhibitors', href: '#exhibitors' },
//     { name: 'Gallery', href: '#gallery' },
//     { name: 'Register', href: '#contact' },
//   ];

//   const scrollToSection = (href: string) => {
//     const element = document.querySelector(href);
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth' });
//     }
//     setIsMobileMenuOpen(false);
//   };

//   return (
//    <nav className={`fixed top-[60px] left-0 right-0 z-50 transition-all duration-300 ${
//       isScrolled 
//         ? 'bg-black/95 backdrop-blur-md shadow-2xl py-3' 
//         : 'bg-transparent py-6'
//     }`}>
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <div className="text-2xl font-bold">
//             <span className="text-[#FFD400]">Drone</span>
//             <span className="text-[#FF0000]">Fair</span>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden lg:flex items-center space-x-8">
//             {navItems.map((item) => (
//               <button
//                 key={item.name}
//                 onClick={() => scrollToSection(item.href)}
//                 className="relative font-medium text-white hover:text-[#FFD400] transition-colors duration-300 group"
//               >
//                 {item.name}
//                 <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF0000] transition-all duration-300 group-hover:w-full"></span>
//               </button>
//             ))}
//           </div>

//           {/* CTA Buttons */}
//           <div className="hidden lg:flex items-center gap-4">
//             <button className="border-2 border-[#FFD400] text-[#FFD400] hover:bg-[#FFD400] hover:text-black px-6 py-2 rounded-full font-semibold transition-all duration-300">
//               Book Stall
//             </button>
//             <button className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
//               Attend Event
//             </button>
//           </div>

//           {/* Mobile Menu Toggle */}
//           <button
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             className="lg:hidden p-2 text-white"
//           >
//             {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <div className="lg:hidden mt-4 py-4 bg-black/95 backdrop-blur-md rounded-lg border border-gray-800">
//             {navItems.map((item) => (
//               <button
//                 key={item.name}
//                 onClick={() => scrollToSection(item.href)}
//                 className="block w-full text-left px-4 py-3 text-white hover:text-[#FFD400] hover:bg-white/5 transition-colors"
//               >
//                 {item.name}
//               </button>
//             ))}
//             <div className="flex flex-col gap-2 px-4 mt-4">
//               <button className="border-2 border-[#FFD400] text-[#FFD400] hover:bg-[#FFD400] hover:text-black px-6 py-2 rounded-full font-semibold transition-colors">
//                 Book Stall
//               </button>
//               <button className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-6 py-2 rounded-full font-semibold transition-colors">
//                 Attend Event
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navigation;








// import React, { useState, useEffect } from 'react';
// import { Menu, X, Edit2 } from 'lucide-react';

// const Navigation: React.FC = () => {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [editing, setEditing] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 50);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Editable State
//   const [logoText, setLogoText] = useState({ first: 'Drone', second: 'Fair' });
//   const [navItems, setNavItems] = useState([
//     { name: 'Home', href: '#home' },
//     { name: 'Highlights', href: '#highlights' },
//     { name: 'Speakers', href: '#speakers' },
//     { name: 'Schedule', href: '#schedule' },
//     { name: 'Exhibitors', href: '#exhibitors' },
//     { name: 'Gallery', href: '#gallery' },
//     { name: 'Register', href: '#contact' },
//   ]);
//   const [ctaButtons, setCtaButtons] = useState({ book: 'Book Stall', attend: 'Attend Event' });

//   const scrollToSection = (href: string) => {
//     const element = document.querySelector(href);
//     if (element) element.scrollIntoView({ behavior: 'smooth' });
//     setIsMobileMenuOpen(false);
//   };

//   // Editable nav item change
//   const handleNavItemChange = (index: number, value: string) => {
//     const updated = [...navItems];
//     updated[index].name = value;
//     setNavItems(updated);
//   };

//   return (
//     <nav
//       className={`fixed top-[60px] left-0 right-0 z-50 transition-all duration-300 ${
//         isScrolled ? 'bg-black/95 backdrop-blur-md shadow-2xl py-3' : 'bg-transparent py-6'
//       }`}
//     >
//       <div className="container mx-auto px-4 relative">
//         {/* Edit Button */}
//         <button
//           onClick={() => setEditing(!editing)}
//           className="absolute top-2 right-2 z-20 bg-[#FFD400] hover:bg-[#FFD400]/90 text-black px-3 py-1 rounded-full font-semibold flex items-center gap-1"
//         >
//           <Edit2 size={16} />
//           {editing ? 'Done' : 'Edit'}
//         </button>

//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <div className="text-2xl font-bold">
//             {editing ? (
//               <>
//                 <input
//                   value={logoText.first}
//                   onChange={e => setLogoText(prev => ({ ...prev, first: e.target.value }))}
//                   className="bg-transparent border-b border-[#FFD400] text-[#FFD400] text-2xl font-bold mr-1"
//                 />
//                 <input
//                   value={logoText.second}
//                   onChange={e => setLogoText(prev => ({ ...prev, second: e.target.value }))}
//                   className="bg-transparent border-b border-[#FF0000] text-[#FF0000] text-2xl font-bold"
//                 />
//               </>
//             ) : (
//               <>
//                 <span className="text-[#FFD400]">{logoText.first}</span>
//                 <span className="text-[#FF0000]">{logoText.second}</span>
//               </>
//             )}
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden lg:flex items-center space-x-8">
//             {navItems.map((item, index) =>
//               editing ? (
//                 <input
//                   key={index}
//                   value={item.name}
//                   onChange={e => handleNavItemChange(index, e.target.value)}
//                   className="bg-transparent border-b border-gray-500 text-white px-1 py-0.5 rounded"
//                 />
//               ) : (
//                 <button
//                   key={index}
//                   onClick={() => scrollToSection(item.href)}
//                   className="relative font-medium text-white hover:text-[#FFD400] transition-colors duration-300 group"
//                 >
//                   {item.name}
//                   <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF0000] transition-all duration-300 group-hover:w-full"></span>
//                 </button>
//               )
//             )}
//           </div>

//           {/* CTA Buttons */}
//           <div className="hidden lg:flex items-center gap-4">
//             {editing ? (
//               <>
//                 <input
//                   value={ctaButtons.book}
//                   onChange={e => setCtaButtons(prev => ({ ...prev, book: e.target.value }))}
//                   className="bg-transparent border border-[#FFD400] text-[#FFD400] px-4 py-2 rounded-full font-semibold"
//                 />
//                 <input
//                   value={ctaButtons.attend}
//                   onChange={e => setCtaButtons(prev => ({ ...prev, attend: e.target.value }))}
//                   className="bg-[#FF0000] text-white px-4 py-2 rounded-full font-semibold"
//                 />
//               </>
//             ) : (
//               <>
//                 <button className="border-2 border-[#FFD400] text-[#FFD400] hover:bg-[#FFD400] hover:text-black px-6 py-2 rounded-full font-semibold transition-all duration-300">
//                   {ctaButtons.book}
//                 </button>
//                 <button className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
//                   {ctaButtons.attend}
//                 </button>
//               </>
//             )}
//           </div>

//           {/* Mobile Menu Toggle */}
//           <button
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             className="lg:hidden p-2 text-white"
//           >
//             {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <div className="lg:hidden mt-4 py-4 bg-black/95 backdrop-blur-md rounded-lg border border-gray-800">
//             {navItems.map((item, index) =>
//               editing ? (
//                 <input
//                   key={index}
//                   value={item.name}
//                   onChange={e => handleNavItemChange(index, e.target.value)}
//                   className="block w-full text-left px-4 py-3 bg-transparent border-b border-gray-500 text-white"
//                 />
//               ) : (
//                 <button
//                   key={index}
//                   onClick={() => scrollToSection(item.href)}
//                   className="block w-full text-left px-4 py-3 text-white hover:text-[#FFD400] hover:bg-white/5 transition-colors"
//                 >
//                   {item.name}
//                 </button>
//               )
//             )}
//             <div className="flex flex-col gap-2 px-4 mt-4">
//               {editing ? (
//                 <>
//                   <input
//                     value={ctaButtons.book}
//                     onChange={e => setCtaButtons(prev => ({ ...prev, book: e.target.value }))}
//                     className="bg-transparent border border-[#FFD400] text-[#FFD400] px-4 py-2 rounded-full font-semibold"
//                   />
//                   <input
//                     value={ctaButtons.attend}
//                     onChange={e => setCtaButtons(prev => ({ ...prev, attend: e.target.value }))}
//                     className="bg-[#FF0000] text-white px-4 py-2 rounded-full font-semibold"
//                   />
//                 </>
//               ) : (
//                 <>
//                   <button className="border-2 border-[#FFD400] text-[#FFD400] hover:bg-[#FFD400] hover:text-black px-6 py-2 rounded-full font-semibold transition-colors">
//                     {ctaButtons.book}
//                   </button>
//                   <button className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-6 py-2 rounded-full font-semibold transition-colors">
//                     {ctaButtons.attend}
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navigation;




// import React, { useState, useEffect } from 'react';
// import { Menu, X, Edit2 } from 'lucide-react';

// const Navigation: React.FC = () => {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [editing, setEditing] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 50);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Editable State
//   const [logoText, setLogoText] = useState({ first: 'Drone', second: 'Fair' });
//   const [navItems, setNavItems] = useState([
//     { name: 'Home', href: '#home' },
//     { name: 'Highlights', href: '#highlights' },
//     { name: 'Speakers', href: '#speakers' },
//     { name: 'Schedule', href: '#schedule' },
//     { name: 'Exhibitors', href: '#exhibitors' },
//     { name: 'Gallery', href: '#gallery' },
//     { name: 'Register', href: '#contact' },
//   ]);
//   const [ctaButtons, setCtaButtons] = useState({ book: 'Book Stall', attend: 'Attend Event' });

//   const scrollToSection = (href: string) => {
//     if (editing) return; // disable scroll while editing
//     const element = document.querySelector(href);
//     if (element) element.scrollIntoView({ behavior: 'smooth' });
//     setIsMobileMenuOpen(false);
//   };

//   return (
//     <nav
//       className={`fixed top-[60px] left-0 right-0 z-50 transition-all duration-300 ${
//         isScrolled ? 'bg-black/95 backdrop-blur-md shadow-2xl py-3' : 'bg-transparent py-6'
//       }`}
//     >
//       <div className="container mx-auto px-4 relative">
//         {/* Edit Button at top-right */}
//         <button
//           onClick={() => setEditing(!editing)}
//           className="absolute -top-10 right-0 z-20 bg-[#FFD400] hover:bg-[#FFD400]/90 text-black px-3 py-1 rounded-full font-semibold flex items-center gap-1"
//         >
//           <Edit2 size={16} />
//           {editing ? 'Done' : 'Edit'}
//         </button>

//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <div className="text-2xl font-bold flex gap-1">
//             {editing ? (
//               <>
//                 <input
//                   value={logoText.first}
//                   onChange={e => setLogoText(prev => ({ ...prev, first: e.target.value }))}
//                   className="bg-transparent border-b border-[#FFD400] text-[#FFD400] text-2xl font-bold px-1 py-0.5"
//                 />
//                 <input
//                   value={logoText.second}
//                   onChange={e => setLogoText(prev => ({ ...prev, second: e.target.value }))}
//                   className="bg-transparent border-b border-[#FF0000] text-[#FF0000] text-2xl font-bold px-1 py-0.5"
//                 />
//               </>
//             ) : (
//               <>
//                 <span className="text-[#FFD400]">{logoText.first}</span>
//                 <span className="text-[#FF0000]">{logoText.second}</span>
//               </>
//             )}
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden lg:flex items-center space-x-8">
//             {navItems.map((item, index) =>
//               editing ? (
//                 <input
//                   key={index}
//                   value={item.name}
//                   onChange={e => {
//                     const updated = [...navItems];
//                     updated[index].name = e.target.value;
//                     setNavItems(updated);
//                   }}
//                   className="bg-transparent border-b border-gray-500 text-white px-1 py-0.5 text-sm"
//                 />
//               ) : (
//                 <button
//                   key={index}
//                   onClick={() => scrollToSection(item.href)}
//                   className="relative font-medium text-white hover:text-[#FFD400] transition-colors duration-300 group"
//                 >
//                   {item.name}
//                   <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF0000] transition-all duration-300 group-hover:w-full"></span>
//                 </button>
//               )
//             )}
//           </div>

//           {/* CTA Buttons */}
//           <div className="hidden lg:flex items-center gap-4">
//             {editing ? (
//               <>
//                 <input
//                   value={ctaButtons.book}
//                   onChange={e => setCtaButtons(prev => ({ ...prev, book: e.target.value }))}
//                   className="bg-transparent border border-[#FFD400] text-[#FFD400] px-4 py-1 rounded-full text-sm font-semibold"
//                 />
//                 <input
//                   value={ctaButtons.attend}
//                   onChange={e => setCtaButtons(prev => ({ ...prev, attend: e.target.value }))}
//                   className="bg-[#FF0000] text-white px-4 py-1 rounded-full text-sm font-semibold"
//                 />
//               </>
//             ) : (
//               <>
//                 <button className="border-2 border-[#FFD400] text-[#FFD400] hover:bg-[#FFD400] hover:text-black px-6 py-2 rounded-full font-semibold transition-all duration-300">
//                   {ctaButtons.book}
//                 </button>
//                 <button className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
//                   {ctaButtons.attend}
//                 </button>
//               </>
//             )}
//           </div>

//           {/* Mobile Menu Toggle */}
//           <button
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             className="lg:hidden p-2 text-white"
//             disabled={editing} // disable toggle while editing
//           >
//             {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <div className="lg:hidden mt-4 py-4 bg-black/95 backdrop-blur-md rounded-lg border border-gray-800">
//             {navItems.map((item, index) =>
//               editing ? (
//                 <input
//                   key={index}
//                   value={item.name}
//                   onChange={e => {
//                     const updated = [...navItems];
//                     updated[index].name = e.target.value;
//                     setNavItems(updated);
//                   }}
//                   className="block w-full text-left px-4 py-2 bg-transparent border-b border-gray-500 text-white"
//                 />
//               ) : (
//                 <button
//                   key={index}
//                   onClick={() => scrollToSection(item.href)}
//                   className="block w-full text-left px-4 py-3 text-white hover:text-[#FFD400] hover:bg-white/5 transition-colors"
//                 >
//                   {item.name}
//                 </button>
//               )
//             )}
//             <div className="flex flex-col gap-2 px-4 mt-4">
//               {editing ? (
//                 <>
//                   <input
//                     value={ctaButtons.book}
//                     onChange={e => setCtaButtons(prev => ({ ...prev, book: e.target.value }))}
//                     className="bg-transparent border border-[#FFD400] text-[#FFD400] px-4 py-1 rounded-full text-sm font-semibold"
//                   />
//                   <input
//                     value={ctaButtons.attend}
//                     onChange={e => setCtaButtons(prev => ({ ...prev, attend: e.target.value }))}
//                     className="bg-[#FF0000] text-white px-4 py-1 rounded-full text-sm font-semibold"
//                   />
//                 </>
//               ) : (
//                 <>
//                   <button className="border-2 border-[#FFD400] text-[#FFD400] hover:bg-[#FFD400] hover:text-black px-6 py-2 rounded-full font-semibold transition-colors">
//                     {ctaButtons.book}
//                   </button>
//                   <button className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-6 py-2 rounded-full font-semibold transition-colors">
//                     {ctaButtons.attend}
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navigation;





import React, { useState, useEffect } from 'react';
import { Menu, X, Edit2 } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [logoText, setLogoText] = useState({ first: 'Drone', second: 'Fair' });
  const [navItems, setNavItems] = useState([
    { name: 'Home', href: '#home' },
    { name: 'Highlights', href: '#highlights' },
    { name: 'Speakers', href: '#speakers' },
    { name: 'Schedule', href: '#schedule' },
    { name: 'Exhibitors', href: '#exhibitors' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Register', href: '#contact' },
  ]);
  const [ctaButtons, setCtaButtons] = useState({ book: 'Book Stall', attend: 'Attend Event' });

  const scrollToSection = (href: string) => {
    if (editing) return;
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-[60px] left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/95 backdrop-blur-md shadow-2xl py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold flex gap-1">
            {editing ? (
              <>
                <input
                  value={logoText.first}
                  onChange={e => setLogoText(prev => ({ ...prev, first: e.target.value }))}
                  className="bg-transparent border-b border-[#FFD400] text-[#FFD400] text-2xl font-bold px-1 py-0.5 w-[70px]"
                />
                <input
                  value={logoText.second}
                  onChange={e => setLogoText(prev => ({ ...prev, second: e.target.value }))}
                  className="bg-transparent border-b border-[#FF0000] text-[#FF0000] text-2xl font-bold px-1 py-0.5 w-[70px]"
                />
              </>
            ) : (
              <>
                <span className="text-[#FFD400]">{logoText.first}</span>
                <span className="text-[#FF0000]">{logoText.second}</span>
              </>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) =>
              editing ? (
                <input
                  key={index}
                  value={item.name}
                  onChange={e => {
                    const updated = [...navItems];
                    updated[index].name = e.target.value;
                    setNavItems(updated);
                  }}
                  className="bg-transparent border-b border-gray-500 text-white px-1 py-0.5 text-sm w-[80px] text-center"
                />
              ) : (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.href)}
                  className="relative font-medium text-white hover:text-[#FFD400] transition-colors duration-300 group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF0000] transition-all duration-300 group-hover:w-full"></span>
                </button>
              )
            )}
          </div>

          {/* CTA Buttons + Edit */}
          <div className="hidden lg:flex items-center gap-4">
            {editing ? (
              <>
                <input
                  value={ctaButtons.book}
                  onChange={e => setCtaButtons(prev => ({ ...prev, book: e.target.value }))}
                  className="bg-transparent border border-[#FFD400] text-[#FFD400] px-4 py-1 rounded-full text-sm font-semibold w-[120px]"
                />
                <input
                  value={ctaButtons.attend}
                  onChange={e => setCtaButtons(prev => ({ ...prev, attend: e.target.value }))}
                  className="bg-[#FF0000] text-white px-4 py-1 rounded-full text-sm font-semibold w-[120px]"
                />
                <button
                  onClick={() => setEditing(!editing)}
                  className="bg-[#FFD400] hover:bg-[#FFD400]/90 text-black px-3 py-1 rounded-full font-semibold flex items-center gap-1"
                >




                  <Edit2 size={16} />
                  {editing ? 'Done' : 'Edit'}
                </button>
              </>
            ) : (
              <>
                <button className="border-2 border-[#FFD400] text-[#FFD400] hover:bg-[#FFD400] hover:text-black px-6 py-2 rounded-full font-semibold transition-all duration-300">
                  {ctaButtons.book}
                </button>
                <button className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                  {ctaButtons.attend}
                </button>
                <button
                  onClick={() => setEditing(!editing)}
                  className="bg-[#FFD400] hover:bg-[#FFD400]/90 text-black px-3 py-1 rounded-full font-semibold flex items-center gap-1"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white"
            disabled={editing}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 bg-black/95 backdrop-blur-md rounded-lg border border-gray-800">
            {navItems.map((item, index) =>
              editing ? (
                <input
                  key={index}
                  value={item.name}
                  onChange={e => {
                    const updated = [...navItems];
                    updated[index].name = e.target.value;
                    setNavItems(updated);
                  }}
                  className="block w-full text-left px-4 py-2 bg-transparent border-b border-gray-500 text-white"
                />
              ) : (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left px-4 py-3 text-white hover:text-[#FFD400] hover:bg-white/5 transition-colors"
                >
                  {item.name}
                </button>
              )
            )}
            <div className="flex flex-col gap-2 px-4 mt-4">
              {editing ? (
                <>
                  <input
                    value={ctaButtons.book}
                    onChange={e => setCtaButtons(prev => ({ ...prev, book: e.target.value }))}
                    className="bg-transparent border border-[#FFD400] text-[#FFD400] px-4 py-1 rounded-full text-sm font-semibold"
                  />
                  <input
                    value={ctaButtons.attend}
                    onChange={e => setCtaButtons(prev => ({ ...prev, attend: e.target.value }))}
                    className="bg-[#FF0000] text-white px-4 py-1 rounded-full text-sm font-semibold"
                  />
                </>
              ) : (
                <>
                  <button className="border-2 border-[#FFD400] text-[#FFD400] hover:bg-[#FFD400] hover:text-black px-6 py-2 rounded-full font-semibold transition-colors">
                    {ctaButtons.book}
                  </button>
                  <button className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-6 py-2 rounded-full font-semibold transition-colors">
                    {ctaButtons.attend}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
