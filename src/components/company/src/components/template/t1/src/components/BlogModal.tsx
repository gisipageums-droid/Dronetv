import { motion } from "motion/react";

export default function BlogModal({
  blog,
  onClose,
}: {
  blog: any;
  onClose: () => void;
}) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-ink/50 dark:bg-black/70'>
      <motion.div className='bg-surface-card dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full p-8 relative transition-colors duration-300 mx-4'>
        <button
          className='absolute top-4 right-4 text-ink-paragraph dark:text-gray-300 hover:text-ink-charcoal dark:hover:text-gray-100 transition-colors duration-300 text-2xl'
          onClick={onClose}
        >
          ×
        </button>
        <img
          src={blog.image}
          className='w-full h-64 object-cover rounded-xl mb-6'
        />
        <p className='text-sm text-ink-caption dark:text-gray-400 transition-colors duration-300'>
          {blog.date} • {blog.category}
        </p>
        <h2 className='text-3xl font-bold text-ink dark:text-indigo-400 mb-4 transition-colors duration-300'>
          {blog.title}
        </h2>
        <p className='text-ink-paragraph dark:text-gray-300 transition-colors duration-300'>
          {blog.content}
        </p>
      </motion.div>
    </div>
  );
}
