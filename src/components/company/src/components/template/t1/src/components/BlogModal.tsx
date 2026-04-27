import { motion } from "motion/react";

export default function BlogModal({
  blog,
  onClose,
}: {
  blog: any;
  onClose: () => void;
}) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70'>
      <motion.div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full p-8 relative transition-colors duration-300 mx-4'>
        <button
          className='absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-300 text-2xl'
          onClick={onClose}
        >
          ×
        </button>
        <img
          src={blog.image}
          className='w-full h-64 object-cover rounded-xl mb-6'
        />
        <p className='text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300'>
          {blog.date} • {blog.category}
        </p>
        <h2 className='text-3xl font-bold text-gray-900 dark:text-indigo-400 mb-4 transition-colors duration-300'>
          {blog.title}
        </h2>
        <p className='text-gray-700 dark:text-gray-300 transition-colors duration-300'>
          {blog.content}
        </p>
      </motion.div>
    </div>
  );
}
