import React from 'react'
import { Link } from 'react-router-dom'

export default function Notfound() {
  return (
    <>
     <div className="fixed inset-0 bg-indigo-900 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse mb-6">
              <svg
                className="w-12 h-12 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 
1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Error 404</h1>
              <p className="text-blue-200 text-lg mb-4">
                AI cannot read your website URL. Please refill the form and try again.
              </p>  
              <Link 
                to="/companies" 
                className="bg-white text-indigo-900 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                Select Template Again
              </Link>
          </div>
        </div>
                  </>
  )
}
