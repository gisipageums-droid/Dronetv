import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { FiSkipBack } from "react-icons/fi";
export default function Back() {
  const navigate = useNavigate();

  return (
    <>
      <motion.div className="fixed bottom-20 right-[13rem] z-50">
        <motion.button
          onClick={() => navigate("/user-events")}
          className="bg-gray-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg flex items-center gap-2"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiSkipBack size={18} />
          Go back
        </motion.button>
      </motion.div>

    </>
  );
}
