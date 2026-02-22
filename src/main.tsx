import { createRoot } from "react-dom/client";
iimport { inject } from "@vercel/analytics"
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
