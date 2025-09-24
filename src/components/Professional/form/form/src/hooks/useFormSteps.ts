import { useState } from "react";

export const useFormSteps = (totalSteps: number) => {
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent(prev => Math.min(prev + 1, totalSteps - 1));
  const prev = () => setCurrent(prev => Math.max(prev - 1, 0));
  return { current, next, prev, goTo: setCurrent };
};
