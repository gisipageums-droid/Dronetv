// src/steps/Success.tsx
// import React from "react";

export default function Success() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
      <div className="text-green-600 text-5xl mb-4">✓</div>
      <h2 className="text-2xl font-semibold">Submission successful!</h2>
      <p className="text-gray-600 mt-2">
        Thank you for submitting your professional information.
      </p>
    </div>
  );
}
