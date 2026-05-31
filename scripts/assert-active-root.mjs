import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pkgPath = path.join(projectRoot, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

if (pkg.name !== "cognitive-learning-system") {
  console.error(`[cls] Wrong package at ${projectRoot} (name=${pkg.name}).`);
  console.error("[cls] Run dev from studyassistantai/cognitive-pwa only.");
  process.exit(1);
}

const cwd = process.cwd().replace(/\\/g, "/").toLowerCase();
if (cwd.includes("studyassistantai02")) {
  console.error("[cls] Refusing to run: cwd is studyassistantai02.");
  console.error("[cls] Use: cd C:\\Users\\eugen\\studyassistantai\\cognitive-pwa");
  process.exit(1);
}

if (!cwd.endsWith("/cognitive-pwa") && !cwd.endsWith("\\cognitive-pwa")) {
  console.warn(`[cls] Warning: cwd is not cognitive-pwa (${process.cwd()})`);
}

console.log(`[cls] Active PWA root: ${projectRoot}`);
