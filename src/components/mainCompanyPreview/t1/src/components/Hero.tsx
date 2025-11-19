import { motion } from "framer-motion";
import HeroBackground from "../public/images/Hero/HeroBackground.jpg";

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const imageVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Hero({ heroData }) {
  return (
    <section
      id='home'
      className='relative h-100vh flex items-center py-52 sm:px-6 lg:px-8 lg:pb-32'
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${HeroBackground}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "scroll",
      }}
    >
      {/* Hero content */}
      <div className='relative z-10 max-w-7xl mx-auto w-full '>
        <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center'>
          {/* Text section */}
          <motion.div
            className='space-y-8 text-center lg:text-left order-2 lg:order-1'
            initial='hidden'
            animate='visible'
            variants={itemVariants}
          >
            <motion.h1
              className='text-3xl sm:text-4xl md:text-5xl xl:text-3xl font-bold text-white leading-tight px-2 sm:px-0'
              variants={itemVariants}
            >
              {heroData.heading}
              <span className='block text-yellow-400 mt-2'>
                {heroData.subheading}
              </span>
            </motion.h1>

            <motion.p
              className='text-base sm:text-md lg:text-md text-gray-200 max-w-2xl mx-auto lg:mx-0 px-2 sm:px-0 leading-relaxed text-justify'
              variants={itemVariants}
            >
              {heroData.description}
            </motion.p>

            {/* Buttons */}
            <motion.div
              className='flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start px-2 sm:px-0'
              variants={itemVariants}
            >
              <a
                href={heroData.primaryButtonLink}
                className='bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-full px-8 py-4 font-semibold transition-all duration-300 transform hover:scale-105 inline-block text-center'
              >
                {heroData.primaryBtn}
              </a>
              <a
                href={heroData.secondaryButtonLink}
                className='text-white border border-white hover:bg-white hover:text-gray-900 rounded-full px-8 py-4 font-semibold transition-all duration-300 inline-block text-center'
              >
                {heroData.secondaryBtn}
              </a>
            </motion.div>

            {/* Customers */}
            <motion.div
              className='flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6 pt-8 px-2 sm:px-0'
              variants={itemVariants}
            >
              <div className='flex -space-x-2'>
                {heroData.customerImages.map((img, i) => (
                  <motion.div
                    key={i}
                    className='w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-lg bg-cover bg-center relative'
                    style={{ backgroundImage: `url('${img}')` }}
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                ))}
              </div>
              <span className='text-sm sm:text-base text-white font-normal'>
                {heroData.trustText}
              </span>
            </motion.div>
          </motion.div>

          {/* Images */}
          <motion.div
            className='relative order-1 lg:order-2 flex justify-center lg:justify-end px-4 sm:px-0'
            initial='hidden'
            animate='visible'
            variants={itemVariants}
          >
            <div className='relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl'>
              <motion.div className='relative' variants={imageVariants}>
                <div className='relative'>
                  <img
                    src={heroData.hero1Image || 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800'}
                    alt='Innovation showcase'
                    className='w-full h-auto object-contain rounded-3xl shadow-2xl'
                    style={{ maxHeight: '70vh' }}
                  />

                </div>
                <motion.div
                  className='absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 lg:-bottom-8 lg:-left-8'
                  variants={imageVariants}
                  transition={{ delay: 0.3 }}
                >
                  <div className='relative'>
                    <img
                      src={heroData.hero3Image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'}
                      alt='Tech innovation'
                      className='block w-auto h-auto max-w-[12rem] sm:max-w-[8rem] lg:max-w-[10rem] object-contain rounded-2xl shadow-xl border-4 border-white'
                    />

                  </div>
                </motion.div>
                <motion.div
                  className='absolute -top-6 -right-6 w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 rounded-full opacity-80'
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
