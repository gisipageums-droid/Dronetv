// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App.tsx";
// import "./index.css";

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );



import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { FormProvider } from "./context/FormContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FormProvider>
      <App />
    </FormProvider>
  </React.StrictMode>
);
