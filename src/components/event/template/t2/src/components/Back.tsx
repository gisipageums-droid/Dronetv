import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {  Upload } from "lucide-react";
export default function Back() {
  const navigate = useNavigate();

  return (
    <>
      <motion.div className="fixed bottom-20 right-10 z-50">
        <motion.button
          onClick={() => navigate("/event/select")}
          className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg flex items-center gap-2"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Upload size={18} />
          Go back
        </motion.button>
      </motion.div>

    </>
  );
}
