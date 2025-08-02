import React from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import App from "./App";
import "./globals.css";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <>
    <App />
    <Toaster />
  </>
);

