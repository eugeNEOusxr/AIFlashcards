import { useLearningEngine } from "./engine/learningEngine";
import { LearningApp } from "./ui/LearningApp";

export default function App() {
  const model = useLearningEngine();
  return <LearningApp model={model} />;
}
