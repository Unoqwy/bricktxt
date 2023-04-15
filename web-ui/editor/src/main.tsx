import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { backend } from "bricktxt-core";
import { init as wasmInit } from "bricktxt-web-wasm";

backend.init(wasmInit());

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
