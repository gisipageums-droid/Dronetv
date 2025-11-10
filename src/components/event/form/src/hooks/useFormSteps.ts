import { useState, useEffect } from "react";

export const useFormSteps = (totalSteps: number) => {
  // Initialize current step from localStorage
  const [current, setCurrent] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("professionalFormDraft");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.step && Number.isInteger(parsed.step)) {
          return Math.max(0, Math.min(parsed.step, totalSteps - 1));
        }
      }
    } catch (e) {
      console.error("Failed to read step from localStorage on init", e);
    }
    return 0;
  });

  // Persist current step to localStorage whenever it changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem("professionalFormDraft");
      let existingData = {};
      if (saved) {
        existingData = JSON.parse(saved);
      }
      const payload = JSON.stringify({ ...existingData, step: current });
      localStorage.setItem("professionalFormDraft", payload);
    } catch (e) {
      console.error("Failed to save step to localStorage", e);
    }
  }, [current]);

  const next = () => setCurrent(prev => Math.min(prev + 1, totalSteps - 1));
  const prev = () => setCurrent(prev => Math.max(prev - 1, 0));
  return { current, next, prev, goTo: setCurrent };
};
