import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootEl = document.getElementById("root");

if (rootEl) {
  try {
    createRoot(rootEl).render(<App />);
  } catch (error) {
    console.error("Fatal render error:", error);
    rootEl.innerHTML = `
      <div style="padding:40px;max-width:600px;margin:0 auto;font-family:system-ui">
        <h1 style="color:#dc2626">Application Error</h1>
        <pre style="background:#f3f4f6;padding:16px;border-radius:8px;overflow:auto;font-size:12px">${String(error)}</pre>
        <p style="color:#6b7280;margin-top:16px">Check browser console (F12) for details.</p>
      </div>
    `;
  }
}
