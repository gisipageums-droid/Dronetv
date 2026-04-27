"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="top-right" // Keep it at top
      toastOptions={{
        style: {
          zIndex: 9999,        // high enough to be above content
          marginTop: '4rem',   // 4rem = 64px → just below your nav bar
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
