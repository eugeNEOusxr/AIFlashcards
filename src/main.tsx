import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { migrateToFrameOnlyStorage } from "./memory/migrateFrameOnly";
import App from "./App";
import "./styles/learning-app.css";
import "./styles/subject-tiles.css";
import "./styles/subject-world.css";
import "./styles/lesson-chamber.css";
import "./styles/cognitive-layer.css";
import "./styles/cognitive-checkpoint.css";
import "./styles/curiosity-nodes.css";
import "./styles/curriculum-map.css";
import "./styles/subject-curriculum-spine.css";
import "./styles/physics-module-world.css";
import "./styles/chemistry-module-world.css";
import "./styles/biology-module-world.css";
import "./styles/module-tunnel-progression.css";
import "./styles/curriculum-map-environment.css";
import "./styles/cognitive-frame.css";
import "./styles/mobile-nav.css";

async function boot(): Promise<void> {
  if (import.meta.env.DEV && "serviceWorker" in navigator) {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((reg) => reg.unregister()));
  }

  migrateToFrameOnlyStorage();

  if (import.meta.env.PROD) {
    registerSW({ immediate: true });
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

void boot();
