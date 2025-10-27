// import { motion } from "motion/react";
// import { Button } from "../components/ui/button";
// import { Badge } from "../components/ui/badge";
// import about from "../public/images/About/About.jpg";

// import { useEffect, useState, useRef } from "react";

// export default function About() {
//   const useScrollAnimation = () => {
//     const [ref, setRef] = useState<Element | null>(null);
//     const [isVisible, setIsVisible] = useState(false);

//     useEffect(() => {
//       if (!ref) return;

//       const observer = new IntersectionObserver(
//         ([entry]) => {
//           setIsVisible(entry.isIntersecting);
//         },
//         { threshold: 0.1 }
//       );

//       observer.observe(ref);
//       return () => observer.unobserve(ref);
//     }, [ref]);

//     return [setRef, isVisible] as const;
//   };
//   const [aboutRef, aboutVisible] = useScrollAnimation();
//   return (
//     <section
//       id="about"
//       ref={aboutRef}
//       className="py-20 bg-[#edf2ff] scroll-mt-20"
//     >
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           <motion.div
//             initial={{ opacity: 0, x: -60 }}
//             animate={aboutVisible ? { opacity: 1, x: 0 } : {}}
//             transition={{ duration: 0.8 }}
//           >
//             <Badge className="bg-[#ffeb3b] text-gray-900 mb-4">
//               About Company
//             </Badge>
//             <h2 className="text-3xl font-bold text-gray-900 mb-6">
//               About Company
//             </h2>

//             <div className="space-y-4 text-gray-700">
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <strong>Company:</strong> Innovative Labs
//                 </div>
//                 <div>
//                   <strong>Industry:</strong> Technology & Innovation
//                 </div>
//                 <div>
//                   <strong>Established:</strong> 2015
//                 </div>
//                 <div>
//                   <strong>Headquarters:</strong> Silicon Valley
//                 </div>
//               </div>

//               <p className="text-gray-600 leading-relaxed">
//                 Our company offers innovative solutions designed to meet your
//                 unique business needs. With a team of experts, we ensure
//                 quality, reliability, and on-time delivery in every project.
//                 From planning to execution, we provide end-to-end services that
//                 drive sustainable growth.
//               </p>

//               <div className="space-y-2">
//                 <p>
//                   <strong>Mission:</strong> To create cutting-edge solutions
//                   that empower businesses through innovation and technology.
//                 </p>
//                 <p>
//                   <strong>Vision:</strong> To be a global leader in driving
//                   innovation that shapes a smarter, sustainable future.
//                 </p>
//               </div>
//             </div>

//             <Button className="bg-[#ffeb3b] text-gray-900 hover:bg-[#ffeb3b]/90 rounded-full mt-6">
//               Learn More
//             </Button>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, x: 60 }}
//             animate={aboutVisible ? { opacity: 1, x: 0 } : {}}
//             transition={{ duration: 0.8, delay: 0.2 }}
//           >
//             <img
//               src={about}
//               alt="About Company"
//               className="rounded-2xl shadow-2xl w-full"
//             />
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }

import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";

// Custom Badge component
const Badge = ({ children, className }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-b from-blue-50 to-white scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start" ref={ref}>
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div>
              <Badge className="bg-yellow-400 text-gray-900 mb-4">
                About Company
              </Badge>

              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                About Innovative Labs
              </h2>
            </div>

            {/* Company Info Grid */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">
                    Company
                  </p>
                  <p className="font-semibold text-gray-900">Innovative Labs</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">
                    Industry
                  </p>
                  <p className="font-semibold text-gray-900">
                    Aerial Survey & Mapping
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">
                    Established
                  </p>
                  <p className="font-semibold text-gray-900">2022-01-31</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">
                    Headquarters
                  </p>
                  <p className="font-semibold text-gray-900">
                    Hyderabad, TS, IN
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed text-base">
                Our company offers innovative solutions designed to meet your
                unique business needs. With a team of experts, we ensure
                quality, reliability, and on-time delivery in every project.
                From planning to execution, we provide end-to-end services that
                drive sustainable growth.
              </p>
              <p className="text-gray-600 leading-relaxed text-base">
                aerial photography solutions, quickly expanding to encompass a
                wider range of applications. The founding team's combined
                expertise in aerospace engineering
              </p>
            </div>

            {/* Mission & Vision */}
            <div className="space-y-4">
              <div className="bg-blue-100 rounded-lg p-5 border-l-4 border-blue-600">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">🎯</span> Mission
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  To create cutting-edge solutions that empower businesses
                  through innovation and technology.
                </p>
              </div>
              <div className="bg-purple-100 rounded-lg p-5 border-l-4 border-purple-600">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-purple-600">👁️</span> Vision
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  To be a global leader in driving innovation that shapes a
                  smarter, sustainable future.
                </p>
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 block lg:hidden">
              <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                <span className="text-green-600">✓</span> Certifications
              </h3>
              <ul className="space-y-2">
                <li>DGCA Remote Pilot License</li>
                <li>Professional Drone Operations Certification</li>
                <li>Advanced Aerial Photography Training</li>
              </ul>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 block lg:hidden">
              <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                <span className="text-yellow-600">🏆</span> Achievements
              </h3>
              <ul className="space-y-2">
                <li>50+ Successful Drone Operations Completed</li>
                <li>DGCA Certified Pilots and Operations</li>
                <li>85.8% Project Success Rate Achieved</li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent mix-blend-multiply"></div>
              <img
                src={
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7HGjp8gUNekNAW0V5NjQ8ORjGbNeR7f4xpQ&s"
                }
                alt="Office"
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hidden lg:block">
              <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                <span className="text-green-600">✓</span> Certifications
              </h3>
              <ul className="space-y-2">
                <li>DGCA Remote Pilot License</li>
                <li>Professional Drone Operations Certification</li>
                <li>Advanced Aerial Photography Training</li>
              </ul>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hidden lg:block">
              <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                <span className="text-yellow-600">🏆</span> Achievements
              </h3>
              <ul className="space-y-2">
                <li>50+ Successful Drone Operations Completed</li>
                <li>DGCA Certified Pilots and Operations</li>
                <li>85.8% Project Success Rate Achieved</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
