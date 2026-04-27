import { motion } from "motion/react";
import Cust6 from "../public/images/customers/ben.jpg";
import Cust1 from "../public/images/customers/customer-1.jpg";
import Cust2 from "../public/images/customers/customer-3.jpg";
import Cust3 from "../public/images/customers/customer-4.jpg";
import Cust4 from "../public/images/customers/customer-5.jpg";
import Cust5 from "../public/images/customers/customer-6.jpg";
import Hero1 from "../public/images/Hero/Hero1.jpg";
import Hero3 from "../public/images/Hero/Hero3.jpg";
import HeroBackground from "../public/images/Hero/HeroBackground.jpg";

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const imageVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function Hero() {
  return (
    <section
      id='home'
      className='relative h-100vh flex items-center pt-[128px] pb-16 px-4 sm:px-6 lg:px-8 lg:pb-32'
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${HeroBackground}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "scroll",
        zIndex: 0,
        position: "relative",
      }}
    >
      <div
        className='relative z-10 max-w-7xl mx-auto w-full '
        style={{ zIndex: 10 }}
      >
        <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center'>
          {/* Content Section */}
          <motion.div
            className='space-y-8 text-center lg:text-left order-2 lg:order-1'
            initial='hidden'
            animate='visible'
            variants={itemVariants}
          >
            <motion.h1
              className='text-xl sm:text-xl md:text-xl lg:text-xl xl:text-3xl font-bold text-white leading-tight px-2 pt-24 sm:px-0'
              variants={itemVariants}
            >
              Shaping Tomorrow with Innovation Today,
              <span className='block text-yellow-400 mt-2'>
                Empowering Ideas, Transforming the Future
              </span>
            </motion.h1>

            <motion.p
              className='text-base sm:text-lg lg:text-lg text-gray-200 max-w-2xl mx-auto lg:mx-0 px-2 sm:px-0 leading-relaxed'
              variants={itemVariants}
            >
              We believe in turning bold ideas into lasting impact. Our
              solutions blend technology, creativity, and purpose. Driving
              innovation that shapes industries and communities. Building a
              smarter, sustainable tomorrow — starting today.
            </motion.p>

            <motion.div
              className='flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start px-2 sm:px-0'
              variants={itemVariants}
            >
              <a
                href='#contact'
                className='bg-[#ffeb3b] hover:bg-yellow-300 text-gray-900 rounded-full px-8 py-4 font-semibold transition-all duration-300 transform hover:scale-105 inline-block'
              >
                Get Started
              </a>
              <a
                href='#about'
                className='text-red-500 border border-white hover:bg-white hover:text-gray-900 rounded-full px-8 py-4 font-semibold transition-all duration-300 inline-block'
              >
                Learn More
              </a>
            </motion.div>

            {/* Customer Avatars */}
            <motion.div
              className='flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6 pt-8 px-2 sm:px-0'
              variants={itemVariants}
            >
              <div className='flex items-center space-x-2'>
                <div className='flex -space-x-2'>
                  {[Cust1, Cust2, Cust3, Cust4, Cust5, Cust6].map(
                    (customer, index) => (
                      <motion.div
                        key={index}
                        className='w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-lg'
                        style={{
                          backgroundImage: `url('${customer}')`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          zIndex: 5,
                        }}
                        whileHover={{ scale: 1.2, zIndex: 20 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    )
                  )}
                </div>
              </div>
              <span className='text-sm sm:text-base text-white font-normal'>
                Join 20+ satisfied clients
              </span>
            </motion.div>
          </motion.div>

          {/* Images Section */}
          <motion.div
            className='relative order-1 lg:order-2 flex justify-center lg:justify-end px-4 sm:px-0'
            initial='hidden'
            animate='visible'
            variants={itemVariants}
            style={{ zIndex: 5 }}
          >
            <div className='relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl'>
              {/* Main large image */}
              <motion.div
                className='relative'
                variants={imageVariants}
                style={{ zIndex: 5 }}
              >
                <img
                  src={Hero1}
                  alt='Innovation showcase'
                  className='w-full h-64 sm:h-80 lg:h-96 object-cover rounded-3xl shadow-2xl'
                />

                {/* Floating smaller image */}
                <motion.div
                  className='absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 lg:-bottom-8 lg:-left-8'
                  variants={imageVariants}
                  transition={{ delay: 0.3 }}
                  style={{ zIndex: 6 }}
                >
                  <img
                    src={Hero3}
                    alt='Technology innovation'
                    className='w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-2xl shadow-xl border-4 border-white'
                  />
                </motion.div>

                {/* Optional: Add a decorative element */}
                <motion.div
                  className='absolute -top-6 -right-6 w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 rounded-full opacity-80'
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                  style={{ zIndex: 4 }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div
        className='absolute top-32 left-10 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full opacity-60 animate-pulse'
        style={{ zIndex: 2 }}
      />
      <div
        className='absolute bottom-32 right-10 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full opacity-60 animate-pulse'
        style={{ zIndex: 2 }}
      />
      <div
        className='absolute top-1/2 left-5 w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full opacity-40 animate-bounce'
        style={{ zIndex: 2 }}
      />
    </section>
  );
}
