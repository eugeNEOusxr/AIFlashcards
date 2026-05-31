import { useFrameLearning } from "./engine/useFrameLearning";
import { FrameLearningApp } from "./ui/FrameLearningApp";

export default function App() {
  const model = useFrameLearning();
  return <FrameLearningApp model={model} />;
}
