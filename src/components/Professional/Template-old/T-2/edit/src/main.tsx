// In your main.tsx or index.tsx
import { createRoot } from "react-dom/client";
import EditTemp_2 from "./App";
import { Toaster } from "./components/ui/sonner";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <>
    <EditTemp_2 />
    <Toaster />
  </>
);