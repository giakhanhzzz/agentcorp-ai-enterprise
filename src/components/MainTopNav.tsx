import React from "react";
import {
  Building2,
  Tv,
  Flame,
  MessageSquare,
  Layers,
  Volume2,
  VolumeX,
  PackageCheck,
  FolderKanban,
  Edit3,
  ExternalLink,
  Zap,
  Trophy,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { AISettings, EnterpriseProject } from "../types";

export type MainViewMode = "agent_room" | "web_preview" | "web_movie" | "web_apex" | "web_tft" | "tasks";

interface MainTopNavProps {
  currentView: MainViewMode;
  onSelectView: (view: MainViewMode) => void;
  projects: EnterpriseProject[];
  activeProject: EnterpriseProject;
  onSelectProject: (projectId: string) => void;
  pendingProposalsCount: number;
  completedTasksCount: number;
  totalTasksCount: number;
  aiSettings: AISettings;
  onToggleTTS: () => void;
  onOpenExportModal: () => void;
  onOpenProjectCatalog: () => void;
  onRenameProject: () => void;
}

export const MainTopNav: React.FC<MainTopNavProps> = ({
  currentView,
  onSelectView,
  projects,
  activeProject,
  onSelectProject,
  pendingProposalsCount,
  completedTasksCount,
  totalTasksCount,
  aiSettings,
  onToggleTTS,
  onOpenExportModal,
  onOpenProjectCatalog,
  onRenameProject,
}) => {
  const projNameLower = (activeProject.name || "").toLowerCase();
  const projIdLower = (activeProject.id || "").toLowerCase();
  const projCatLower = (activeProject.category || "").toLowerCase();

  const isTFT =
    projIdLower.includes("tft") ||
    projNameLower.includes("tft") ||
    projNameLower.includes("đấu trường") ||
    projCatLower.includes("tft");

  const isMovie =
    projIdLower.includes("motfilm") ||
    projNameLower.includes("motfilm") ||
    projNameLower.includes("phim") ||
    projCatLower.includes("phim") ||
    projCatLower.includes("streaming");

  const isApex =
    !isTFT &&
    (projIdLower.includes("apex") ||
      projNameLower.includes("apex") ||
      projCatLower.includes("apex") ||
      projCatLower.includes("esport"));

  // Dynamic preview tab metadata based on current active project
  const getLiveTabInfo = () => {
    if (isTFT) {
      const seasonText = activeProject.customSettings?.tftSeason === "13" ? "S13" : "Mùa 18";
      return {
        label: `♟️ Web TFT Meta ${seasonText}`,
        badge: `Live ${seasonText}`,
        gradient: "from-purple-600 via-violet-600 to-indigo-600",
        shadow: "shadow-purple-600/30",
        icon: <Trophy className="w-3.5 h-3.5 text-purple-300" />,
      };
    }
    if (isMovie) {
      return {
        label: "🎬 Web Phim Motfilm 4K",
        badge: "Live OTT",
        gradient: "from-red-600 via-rose-600 to-amber-600",
        shadow: "shadow-red-600/30",
        icon: <Tv className="w-3.5 h-3.5 text-amber-300" />,
      };
    }
    if (isApex) {
      return {
        label: "🎮 Web Apex Tracker",
        badge: "120Hz",
        gradient: "from-orange-600 to-red-600",
        shadow: "shadow-orange-600/30",
        icon: <Flame className="w-3.5 h-3.5 text-orange-300" />,
      };
    }
    return {
      label: `🖥️ Web ${activeProject.name.slice(0, 16)}`,
      badge: "Bản Thử Live",
      gradient: "from-cyan-600 to-blue-600",
      shadow: "shadow-cyan-600/30",
      icon: <Zap className="w-3.5 h-3.5 text-cyan-300" />,
    };
  };

  const liveTab = getLiveTabInfo();

  const isLivePreviewActive =
    currentView === "web_preview" ||
    (isMovie && currentView === "web_movie") ||
    (isApex && currentView === "web_apex") ||
    (isTFT && currentView === "web_tft");

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-col gap-2.5">
        {/* Top Row: Brand, Quick Project Switcher Pills, and Minimal Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Brand & Active Project Title */}
          <div className="flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 ring-1 ring-white/20">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white">
                    AgentCorp
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 uppercase tracking-wider">
                    Autonomous AI
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="text-slate-500">Dự án:</span>
                  <span className="max-w-[150px] sm:max-w-[220px] truncate text-indigo-300 font-bold">
                    {activeProject.name}
                  </span>
                  <button
                    onClick={onRenameProject}
                    className="hover:text-white p-0.5 transition-colors"
                    title="Đổi tên dự án này"
                  >
                    <Edit3 className="w-3 h-3 text-slate-500 hover:text-slate-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Project Switcher: Direct 1-Click Project Pills (TFT, Phim, Apex, ...) */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-1">
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Phân vùng:
            </span>

            {/* Quick Pills for prominent projects */}
            {projects.map((proj) => {
              const pId = proj.id.toLowerCase();
              const pName = proj.name.toLowerCase();
              const isSelected = proj.id === activeProject.id;

              let icon = "📂";
              let shortTitle = proj.name;

              if (pId.includes("tft") || pName.includes("tft") || pName.includes("đấu trường")) {
                icon = "♟️";
                const sTxt = proj.customSettings?.tftSeason === "13" ? "S13" : "Mùa 18";
                shortTitle = `TFT ${sTxt}`;
              } else if (pId.includes("motfilm") || pName.includes("motfilm") || pName.includes("phim")) {
                icon = "🎬";
                shortTitle = "Phim 4K";
              } else if (pId.includes("apex") || pName.includes("apex")) {
                icon = "🎮";
                shortTitle = "Apex Tracker";
              } else if (pId.includes("saas") || pName.includes("saas")) {
                icon = "💼";
                shortTitle = "SaaS AI";
              } else if (pId.includes("cskh") || pName.includes("cskh")) {
                icon = "🎧";
                shortTitle = "CSKH Swarm";
              }

              return (
                <button
                  key={proj.id}
                  onClick={() => onSelectProject(proj.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/50 scale-[1.03]"
                      : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                  title={`Chuyển ngay sang dự án: ${proj.name}`}
                >
                  <span>{icon}</span>
                  <span className="max-w-[110px] truncate">{shortTitle}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </button>
              );
            })}

            {/* Catalog Modal Button */}
            <button
              onClick={onOpenProjectCatalog}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-indigo-300 border border-slate-800 text-xs font-semibold transition-all shrink-0 cursor-pointer ml-1"
              title="Mở kho quản lý tất cả dự án & tạo mới"
            >
              <FolderKanban className="w-3.5 h-3.5 text-indigo-400" />
              <span>Kho ({projects.length})</span>
            </button>
          </div>

          {/* Minimal Right Utilities: TTS, Export */}
          <div className="flex items-center gap-2 justify-end shrink-0">
            <button
              onClick={onToggleTTS}
              className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                aiSettings.ttsEnabled
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-sm"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
              title={aiSettings.ttsEnabled ? "Tắt đọc giọng nói AI" : "Bật đọc giọng nói AI"}
            >
              {aiSettings.ttsEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onOpenExportModal}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 text-xs font-medium transition-all cursor-pointer"
              title="Đóng gói mã nguồn dự án & xuất Git"
            >
              <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Xuất Mã</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: 3 PRIMARY 1-CLICK TABS (Web Agent | Dynamic Live Web | Nhiệm Vụ WBS) */}
        <nav className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner overflow-x-auto custom-scrollbar">
          {/* 1. Web Agent (Phòng Họp & Hộp Chat Chỉ Đạo Riêng Cho Dự Án Này) */}
          <button
            onClick={() => onSelectView("agent_room")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              currentView === "agent_room"
                ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-indigo-300" />
            <span>🏛️ Web Agent (Hội Đồng & Quyết Định)</span>
            {pendingProposalsCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-amber-500 text-slate-950 font-black animate-pulse">
                {pendingProposalsCount} chờ duyệt
              </span>
            )}
          </button>

          {/* 2. DYNAMIC LIVE WEB APP TAB (Shows active project's live preview: TFT, Phim, Apex, ...) */}
          <button
            onClick={() => onSelectView("web_preview")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              isLivePreviewActive
                ? `bg-gradient-to-r ${liveTab.gradient} text-white shadow-lg ${liveTab.shadow} scale-[1.02]`
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            {liveTab.icon}
            <span>{liveTab.label}</span>
            <span className="hidden sm:inline px-1.5 py-0.2 text-[9px] rounded-full bg-white/20 text-white font-bold backdrop-blur-sm">
              {liveTab.badge}
            </span>
          </button>

          {/* 3. Nhiệm Vụ WBS & Mã Nguồn Riêng Của Dự Án */}
          <button
            onClick={() => onSelectView("tasks")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              currentView === "tasks"
                ? "bg-slate-800 text-emerald-300 border border-emerald-500/40 shadow-sm scale-[1.02]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>📋 Nhiệm Vụ & Sản Phẩm</span>
            {totalTasksCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                {completedTasksCount}/{totalTasksCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
