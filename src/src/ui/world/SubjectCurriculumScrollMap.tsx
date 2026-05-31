import type { FrameMapModel } from "../../engine/frameMapModel";
import type { BiologyModuleLandmarkId } from "../../world/biologyModuleLandmarks";
import type { ChemistryModuleLandmarkId } from "../../world/chemistryModuleLandmarks";
import type { PhysicsModuleLandmarkId } from "../../world/physicsModuleLandmarks";
import type { NavScreen, SubjectId } from "../../world/types";
import { BiologyModuleWorldMap } from "./BiologyModuleWorldMap";
import { ChemistryModuleWorldMap } from "./ChemistryModuleWorldMap";
import { PhysicsModuleWorldMap } from "./PhysicsModuleWorldMap";

type Props = {
  subjectId: SubjectId;
  nav: NavScreen;
  mapModel: FrameMapModel;
  onNavigate: (screen: NavScreen) => void;
  onEnterLandmark: (
    landmarkId: PhysicsModuleLandmarkId | ChemistryModuleLandmarkId | BiologyModuleLandmarkId
  ) => void;
};

/**
 * Subject internal progression map — frame modules only.
 */
export function SubjectCurriculumScrollMap(props: Props) {
  if (props.subjectId === "biology") {
    return (
      <BiologyModuleWorldMap
        {...props}
        onEnterLandmark={props.onEnterLandmark as (id: BiologyModuleLandmarkId) => void}
      />
    );
  }

  if (props.subjectId === "chemistry") {
    return (
      <ChemistryModuleWorldMap
        {...props}
        onEnterLandmark={props.onEnterLandmark as (id: ChemistryModuleLandmarkId) => void}
      />
    );
  }

  return (
    <PhysicsModuleWorldMap
      {...props}
      onEnterLandmark={props.onEnterLandmark as (id: PhysicsModuleLandmarkId) => void}
    />
  );
}
