import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, X, Upload, AlertCircle } from "lucide-react";
import { useTemplate } from "../../../../../../context/context";

export default function Publish() {
  const [model, setModel] = useState(false);
  const { publishEventsTemplate } = useTemplate();

  return (
    <>
      <motion.div className="fixed bottom-20 right-10 z-50">
        <motion.button
          onClick={() => setModel(true)}
          className="bg-status-info text-white font-semibold py-3 px-6 rounded-full shadow-lg flex items-center gap-2"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Upload size={18} />
          Publish Site
        </motion.button>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {model && (
          <motion.div
            className="fixed top-[8rem] right-0 bottom-0 left-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModel(false)}
          >
            <motion.div
              className="bg-surface-card rounded-xl shadow-2xl max-w-md w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-status-success" size={24} />
                  <h3 className="text-xl font-semibold text-ink">
                    Confirm Publication
                  </h3>
                </div>

                <button
                  onClick={() => setModel(false)}
                  className="p-1 rounded-full hover:bg-ink-light transition-colors"
                >
                  <X size={20} className="text-ink-caption" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="mb-6">
                <div className="flex items-start gap-3 p-3 bg-status-info/10 rounded-lg mb-4">
                  <AlertCircle
                    size={18}
                    className="text-status-info mt-0.5 flex-shrink-0"
                  />
                  <p className="text-sm text-status-info">
                    Your website will be list immediately after publishing. Make
                    sure all content is correct.
                  </p>
                </div>
                <p className="text-ink-paragraph">
                  Are you sure you want to publish your website? This action
                  cannot be undone.
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 justify-end">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setModel(false)}
                  className="px-4 py-2 text-ink-paragraph font-medium rounded-lg border border-ink-light bg-surface-card hover:bg-ink-light transition-colors"
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => {
                    // Add your publish logic here
                    publishEventsTemplate(); // Call the publish function
                    setModel(false);
                  }}
                  className="px-4 py-2 bg-status-success text-white font-medium rounded-lg hover:bg-status-success transition-colors shadow-md"
                >
                  Confirm & Publish
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
