import type { FrameMapModel } from "../../engine/frameMapModel";
import type { PhysicsModuleLandmarkId } from "../../world/physicsModuleLandmarks";
import type { NavScreen, SubjectId } from "../../world/types";
import { PhysicsModuleWorldMap } from "./PhysicsModuleWorldMap";

type Props = {
  subjectId: SubjectId;
  nav: NavScreen;
  mapModel: FrameMapModel;
  onNavigate: (screen: NavScreen) => void;
  onEnterLandmark: (landmarkId: PhysicsModuleLandmarkId) => void;
};

/**
 * Physics internal module map (SUBJECT nav only).
 * Frame modules only — no legacy lesson arrays.
 */
export function SubjectCurriculumScrollMap(props: Props) {
  return <PhysicsModuleWorldMap {...props} />;
}
