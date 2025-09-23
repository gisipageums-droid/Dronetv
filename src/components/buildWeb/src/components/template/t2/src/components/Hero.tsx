import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Play, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

export default function Hero() {
  const [isEditing, setIsEditing] = useState(false);

  // Hero states
  const [badgeText, setBadgeText] = useState("Trusted by 500+ Companies");
  const [heading, setHeading] = useState("Transform Your Business with");
  const [highlight, setHighlight] = useState("Innovation");
  const [description, setDescription] = useState(
    "We help companies scale and grow with cutting-edge solutions, expert guidance, and proven strategies that deliver"
  );
  const [highlightDesc, setHighlightDesc] = useState("exceptional results");

  // Buttons
  const [primaryBtn, setPrimaryBtn] = useState("Get Started Today");

  // Trust text
  const [trustText, setTrustText] = useState("Join 500+ satisfied clients");

  // Stats
  const [stats, setStats] = useState([
    { id: 1, value: "500+", label: "Happy Clients", color: "red-accent" },
    { id: 2, value: "95%", label: "Success Rate", color: "red-accent" },
    { id: 3, value: "24/7", label: "Support", color: "primary" },
  ]);

  const updateStat = (id: number, field: string, value: string) => {
    setStats((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };
  const addStat = () => {
    setStats((prev) => [
      ...prev,
      { id: Date.now(), value: "0", label: "New Stat", color: "primary" },
    ]);
  };
  const removeStat = (id: number) => {
    setStats((prev) => prev.filter((s) => s.id !== id));
  };

  // Hero image
  const [heroImage, setHeroImage] = useState(
    "https://images.unsplash.com/photo-1698047682129-c3e217ac08b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidXNpbmVzcyUyMHRlYW0lMjBvZmZpY2V8ZW58MXx8fHwxNzU1NjE4MzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080"
  );

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Floating card
  const [cardText, setCardText] = useState("Live Support Available");

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };
  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <section
      id='home'
      className='pt-20 mt-[3rem] pb-16 bg-background relative overflow-hidden theme-transition'
    >
      {/* Background decorations */}
      <motion.div
        className='absolute top-20 right-0 w-72 h-72 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2'
        animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className='absolute bottom-0 left-0 w-96 h-96 bg-primary/3 rounded-full translate-y-1/2 -translate-x-1/2'
        animate={{ scale: [1, 1.2, 1], rotate: [0, -180, -360] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className='absolute top-40 right-20 w-20 h-20 bg-red-accent/10 rounded-full'
        variants={floatingVariants}
        animate='animate'
      />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          {/* Content */}
          <motion.div
            className='space-y-8'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
          >
            <div className='space-y-4'>
              {/* Badge */}
              <motion.div
                className='inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary border border-primary/20 mb-4'
                variants={itemVariants}
              >
                <CheckCircle className='w-4 h-4 mr-2' />
                {isEditing ? (
                  <input
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    className='bg-transparent border-b border-primary text-sm outline-none'
                  />
                ) : (
                  <span className='font-medium text-sm'>{badgeText}</span>
                )}
              </motion.div>

              {/* Heading */}
              <motion.div variants={itemVariants}>
                {isEditing ? (
                  <>
                    <textarea
                      value={heading}
                      onChange={(e) => setHeading(e.target.value)}
                      className='bg-transparent border-b border-foreground text-4xl md:text-6xl leading-tight outline-none w-full max-w-lg'
                    />
                    <input
                      value={highlight}
                      onChange={(e) => setHighlight(e.target.value)}
                      className='bg-transparent border-b border-primary text-4xl md:text-6xl text-primary outline-none'
                    />
                  </>
                ) : (
                  <h1 className='text-4xl md:text-6xl text-foreground leading-tight'>
                    {heading} <span className='text-primary'>{highlight}</span>
                  </h1>
                )}
              </motion.div>

              {/* Description */}
              <motion.div variants={itemVariants}>
                {isEditing ? (
                  <>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className='bg-transparent border-b border-muted-foreground text-xl text-muted-foreground outline-none w-full max-w-lg'
                    />
                    <input
                      value={highlightDesc}
                      onChange={(e) => setHighlightDesc(e.target.value)}
                      className='bg-transparent border-b border-red-accent text-xl font-semibold outline-none'
                    />
                  </>
                ) : (
                  <p className='text-xl text-muted-foreground max-w-lg inline'>
                    {description}{" "}
                    <span className='text-red-accent font-semibold'>
                      {highlightDesc}
                    </span>
                    .
                  </p>
                )}
              </motion.div>
            </div>

            {/* Buttons */}
            <motion.div
              className='flex flex-col sm:flex-row gap-4'
              variants={itemVariants}
            >
              {isEditing ? (
                <>
                  <input
                    value={primaryBtn}
                    onChange={(e) => setPrimaryBtn(e.target.value)}
                    className='bg-transparent border-b border-primary outline-none max-w-[200px]'
                  />
                
                </>
              ) : (
                <>
                  <Button
                    size='lg'
                    className='bg-primary text-primary-foreground shadow-xl'
                  >
                    {primaryBtn}
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </Button>
                
                </>
              )}
            </motion.div>

            {/* Trust text */}
            <motion.div
              className='flex items-center space-x-6 pt-4'
              variants={itemVariants}
            >
              <div className='flex items-center space-x-2'>
                <div className='flex -space-x-2'>
                  <div className='w-8 h-8 bg-primary rounded-full border-2 border-background' />
                  <div className='w-8 h-8 bg-primary/80 rounded-full border-2 border-background' />
                  <div className='w-8 h-8 bg-red-accent rounded-full border-2 border-background' />
                </div>
                {isEditing ? (
                  <input
                    value={trustText}
                    onChange={(e) => setTrustText(e.target.value)}
                    className='bg-transparent border-b border-muted-foreground text-sm outline-none'
                  />
                ) : (
                  <span className='text-sm text-muted-foreground'>
                    {trustText}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className='grid grid-cols-3 gap-8 pt-8'
              variants={itemVariants}
            >
              {stats.map((s) => (
                <div key={s.id} className='group'>
                  {isEditing ? (
                    <div className='flex flex-col gap-1'>
                      <input
                        value={s.value}
                        onChange={(e) =>
                          updateStat(s.id, "value", e.target.value)
                        }
                        className='bg-transparent border-b border-foreground font-bold text-2xl outline-none'
                      />
                      <input
                        value={s.label}
                        onChange={(e) =>
                          updateStat(s.id, "label", e.target.value)
                        }
                        className='bg-transparent border-b border-muted-foreground text-sm outline-none'
                      />
                      <button
                        onClick={() => removeStat(s.id)}
                        className='text-red-500 text-xs'
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <div
                        className={`text-2xl font-bold group-hover:text-${s.color}`}
                      >
                        {s.value}
                      </div>
                      <div className='text-muted-foreground'>{s.label}</div>
                      <div
                        className={`w-8 h-1 bg-${s.color}/30 group-hover:bg-${s.color} mt-1`}
                      />
                    </>
                  )}
                </div>
              ))}
              {isEditing && (
                <button
                  onClick={addStat}
                  className='text-green-600 text-sm font-medium'
                >
                  + Add Stat
                </button>
              )}
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className='relative'
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {isEditing && (
              <div className='mb-4 p-2 bg-white/80 rounded shadow'>
                <p className='text-sm mb-1'>Change Hero Image:</p>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleHeroImageUpload}
                  className='text-sm border-2 border-dashed border-muted-foreground p-2 rounded w-full'
                />
              </div>
            )}
            <motion.div
              className='relative rounded-2xl overflow-hidden shadow-2xl'
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={heroImage}
                alt='Modern business team collaborating'
                className='w-full h-[500px] object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />

              {/* Image overlay decorations */}
              <motion.div
                className='absolute top-4 right-4 w-16 h-16 bg-primary/20 rounded-full backdrop-blur-sm'
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className='absolute top-4 left-4 w-12 h-12 bg-red-accent/20 rounded-full backdrop-blur-sm'
                variants={floatingVariants}
                animate='animate'
              />
            </motion.div>

            {/* Floating card */}
            <motion.div
              className='absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-lg border border-border'
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <div className='flex items-center space-x-3'>
                <motion.div
                  className='w-3 h-3 bg-primary rounded-full'
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {isEditing ? (
                  <input
                    value={cardText}
                    onChange={(e) => setCardText(e.target.value)}
                    className='bg-transparent border-b border-foreground text-sm outline-none'
                  />
                ) : (
                  <span className='text-sm font-medium'>{cardText}</span>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
