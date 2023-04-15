import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { initWebBackend } from "./backend";

initWebBackend();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
