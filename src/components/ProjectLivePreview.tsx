import React from "react";
import { CompanyTask, EnterpriseProject } from "../types";
import { LiveAppPreview } from "./LiveAppPreview";
import { SaaSAppPreview } from "./previews/SaaSAppPreview";
import { CRMAppPreview } from "./previews/CRMAppPreview";
import { GenericCustomPreview } from "./previews/GenericCustomPreview";
import { ApexAppPreview } from "./previews/ApexAppPreview";
import { TFTAppPreview } from "./previews/TFTAppPreview";

interface ProjectLivePreviewProps {
  project: EnterpriseProject;
  tasks: CompanyTask[];
  onOpenCode: () => void;
  onRequestIteration?: (directive: string, createdTask?: any) => void;
  onStartMission?: () => void;
  isStandalone?: boolean;
  onExitStandalone?: () => void;
}

export const ProjectLivePreview: React.FC<ProjectLivePreviewProps> = ({
  project,
  tasks,
  onOpenCode,
  onRequestIteration,
  onStartMission,
  isStandalone,
  onExitStandalone,
}) => {
  const cat = (project.category || "").toLowerCase();
  const id = (project.id || "").toLowerCase();
  const name = (project.name || "").toLowerCase();
  const mission = (project.activeMission || "").toLowerCase();

  // 1. Teamfight Tactics (TFT / Đấu Trường Chân Lý) Project
  const isTFT =
    id.includes("tft") ||
    name.includes("tft") ||
    name.includes("đấu trường") ||
    name.includes("dau truong") ||
    name.includes("dtcl") ||
    cat.includes("tft") ||
    cat.includes("đấu trường") ||
    mission.includes("tft") ||
    mission.includes("đấu trường") ||
    mission.includes("dtcl");

  if (isTFT) {
    return (
      <TFTAppPreview
        project={project}
        tasks={tasks}
        onOpenCode={onOpenCode}
        onRequestIteration={onRequestIteration}
        isStandalone={isStandalone}
        onExitStandalone={onExitStandalone}
      />
    );
  }

  // 2. Apex Legends / Gaming / Esports Analytics Project
  const isApexOrGaming =
    (name.includes("apex") ||
      id.includes("apex") ||
      mission.includes("apex") ||
      cat.includes("apex") ||
      cat.includes("game") ||
      cat.includes("gaming") ||
      cat.includes("esport")) &&
    !isTFT;

  if (isApexOrGaming) {
    return (
      <ApexAppPreview
        project={project}
        tasks={tasks}
        onOpenCode={onOpenCode}
        onRequestIteration={onRequestIteration}
        isStandalone={isStandalone}
        onExitStandalone={onExitStandalone}
      />
    );
  }

  // 2. Movie / Media Streaming Project (Motfilm)
  const isMovieProject =
    (name.includes("motfilm") ||
      name.includes("phim") ||
      cat.includes("phim") ||
      cat.includes("streaming") ||
      cat.includes("media") ||
      mission.includes("phim") ||
      mission.includes("motfilm") ||
      (id === "proj-motfilm" && !name && !mission)) &&
    !isApexOrGaming;

  if (isMovieProject) {
    return (
      <LiveAppPreview
        mission={project.activeMission || project.name}
        tasks={tasks}
        onOpenCode={onOpenCode}
        onRequestIteration={onRequestIteration}
        isStandaloneCinema={isStandalone}
        onExitCinema={onExitStandalone}
      />
    );
  }

  // 3. SaaS AI & B2B Project
  if (
    id === "proj-saas-launch" ||
    cat.includes("saas") ||
    cat.includes("b2b") ||
    name.includes("saas") ||
    name.includes("hyperscale")
  ) {
    return (
      <SaaSAppPreview
        mission={project.activeMission || project.name}
        tasks={tasks}
        onOpenCode={onOpenCode}
        onRequestIteration={(dir) => {
          if (onRequestIteration) onRequestIteration(dir);
        }}
        isStandalone={isStandalone}
        onExitStandalone={onExitStandalone}
      />
    );
  }

  // 4. CRM & Customer Support Swarm Project
  if (
    id === "proj-cskh-swarm" ||
    cat.includes("crm") ||
    cat.includes("cskh") ||
    cat.includes("support") ||
    name.includes("cskh") ||
    name.includes("swarmsupport")
  ) {
    return (
      <CRMAppPreview
        mission={project.activeMission || project.name}
        tasks={tasks}
        onOpenCode={onOpenCode}
        onRequestIteration={(dir) => {
          if (onRequestIteration) onRequestIteration(dir);
        }}
        isStandalone={isStandalone}
        onExitStandalone={onExitStandalone}
      />
    );
  }

  // 5. Any Other / Custom Project
  return (
    <GenericCustomPreview
      project={project}
      tasks={tasks}
      onOpenCode={onOpenCode}
      onRequestIteration={(dir) => {
        if (onRequestIteration) onRequestIteration(dir);
      }}
      onStartMission={onStartMission}
      isStandalone={isStandalone}
      onExitStandalone={onExitStandalone}
    />
  );
};

