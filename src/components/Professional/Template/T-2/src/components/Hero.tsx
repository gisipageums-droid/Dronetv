import { AnimatedButton } from './AnimatedButton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';

export function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center bg-gradient-to-br from-background to-yellow-50 dark:from-background dark:to-yellow-900/20 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight">
              Hi, I'm{' '}
              <span className="text-yellow-500">John Doe</span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              A passionate Full-Stack Developer creating amazing digital experiences 
              with modern technologies and innovative solutions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <AnimatedButton href="#projects" size="lg">
                View My Work
              </AnimatedButton>
              <AnimatedButton href="#contact" variant="secondary" size="lg">
                Get In Touch
              </AnimatedButton>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl text-yellow-500 mb-2">50+</div>
                <p className="text-muted-foreground">Projects</p>
              </div>
              <div className="text-center">
                <div className="text-3xl text-yellow-500 mb-2">3+</div>
                <p className="text-muted-foreground">Years Experience</p>
              </div>
              <div className="text-center">
                <div className="text-3xl text-yellow-500 mb-2">100%</div>
                <p className="text-muted-foreground">Client Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Right Content - User Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div 
                className="absolute inset-0 bg-yellow-400 rounded-3xl transform rotate-6"
                whileHover={{ rotate: 8, scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              ></motion.div>
              <motion.div 
                className="relative bg-card rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ 
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  y: -5
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1634133472760-e5c2bd346787?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwZGV2ZWxvcGVyfGVufDF8fHx8MTc1NzQ4OTAwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="John Doe - Professional Developer"
                  className="w-full h-96 object-cover object-center transition-transform duration-300 hover:scale-110"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}