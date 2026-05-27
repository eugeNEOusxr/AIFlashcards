import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import "./styles/learning-app.css";
import "./styles/subject-tiles.css";
import "./styles/subject-world.css";
import "./styles/lesson-chamber.css";
import "./styles/cognitive-layer.css";
import "./styles/curiosity-nodes.css";
import "./styles/curriculum-map.css";

registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
