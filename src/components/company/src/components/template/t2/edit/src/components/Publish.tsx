import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, X, Upload, AlertCircle } from "lucide-react";3
import { useNavigate } from "react-router-dom";
import { useTemplate,useUserAuth } from "../../../../../../../../context/context"; // Adjust path as needed
export default function Publish() {
  const [model, setModel] = useState(false);
  const { publishTemplate } = useTemplate(); // Get the publish function from context
  const { isLogin } = useUserAuth(); // Get the isLogin state from context
  const [navModel, setNavModel] = useState(false);
 const navigate = useNavigate();
function navigatemodel() {
    if (navModel) {
      return (
        <motion.div
          className="fixed top-0 left-0 w-full h-full bg-black/60 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-600" size={24} />
                <h3 className="text-xl font-semibold text-gray-900">
                  Successfully Published!
                </h3>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-gray-600">
                You have successfully published your template.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => navigate("/")}
                className="px-4 py-2 text-gray-700 font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-200 transition-colors"
              >
                Go to Home
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
              >
                Go to Login
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      );
    } else {
      return null;
    }
  }

  function checkLogin(){
    if(isLogin===false){
      setNavModel(true);
      navigatemodel();
    }else{
     navigate("/user-companies");
     setNavModel(false);
    }
  }
  return (


    <>
      <motion.div className="fixed bottom-20 right-10 z-50">
        <motion.button
          onClick={() => setModel(true)}
          className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg flex items-center gap-2"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Upload size={18} />
          Publish Site
        </motion.button>
      </motion.div>

    {/* Show pop-up only if not logged in */}
   {navModel &&(
    <div className="fixed top-0 left-0 w-full h-full bg-black/60 flex items-center justify-center z-50">
     {navigatemodel()}
    </div>
   )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {model && (
          <motion.div
            className="fixed top-[8rem] right-0 bottom-0 left-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModel(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={24} />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Confirm Publication
                  </h3>
                </div>
                <button
                  onClick={() => setModel(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="mb-6">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg mb-4">
                  <AlertCircle
                    size={18}
                    className="text-blue-600 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-sm text-blue-800">
                    Your website will be list immediately after publishing. Make
                    sure all content is correct.
                  </p>
                </div>
                <p className="text-gray-600">
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
                  className="px-4 py-2 text-gray-700 font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => {
                    // Add your publish logic here
                    publishTemplate(); // Call the publish function
                    setModel(false);
                    checkLogin
                  }}
                  className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-md"
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
