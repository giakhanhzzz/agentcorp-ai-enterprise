import React, { useState } from "react";
import {
  Building2,
  Cpu,
  Volume2,
  VolumeX,
  FileText,
  Users,
  Settings,
  Sparkles,
  Zap,
  Send,
  X,
  ChevronDown,
  ShieldCheck,
  Tv,
  PackageCheck,
  FolderGit2,
  FolderKanban,
  PlusCircle,
  Edit3,
  Plus,
  Headphones,
  Award,
  Share2,
  SplitSquareVertical,
} from "lucide-react";
import { AISettings, MissionPreset } from "../types";
import { PRESET_MISSIONS } from "../data/defaultCompany";

interface NavbarProps {
  aiSettings: AISettings;
  onUpdateAISettings: (settings: AISettings) => void;
  onOpenOrgChart: () => void;
  onOpenAISettings: () => void;
  onOpenExecutiveReport: () => void;
  onOpenTelegramBot: () => void;
  onSwitchToCinema?: () => void;
  onOpenExportModal?: () => void;
  onOpenShareModal?: () => void;
  onOpenBlueprintVault?: () => void;
  onOpenSplitModal?: () => void;
  onOpenProjectCatalog?: () => void;
  onQuickCreateProject?: () => void;
  onRenameProject?: () => void;
  currentProjectTitle?: string;
  currentProjectCategory?: string;
  telegramConnected?: boolean;
  telegramBotUsername?: string;
  hasSynthesis: boolean;
  activePhase: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  aiSettings,
  onUpdateAISettings,
  onOpenOrgChart,
  onOpenAISettings,
  onOpenExecutiveReport,
  onOpenTelegramBot,
  onSwitchToCinema,
  onOpenExportModal,
  onOpenShareModal,
  onOpenBlueprintVault,
  onOpenSplitModal,
  onOpenProjectCatalog,
  onQuickCreateProject,
  onRenameProject,
  currentProjectTitle = "Motfilm Pro 4K (Streaming OTT)",
  currentProjectCategory = "Media & Streaming",
  telegramConnected,
  telegramBotUsername,
  hasSynthesis,
  activePhase,
}) => {
  const [showDetailsPopover, setShowDetailsPopover] = useState(false);

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Brand + Project Context Dropdown */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                AgentCorp
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                Core AI Platform
              </span>

              {/* Project Directory Trigger & Quick Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenProjectCatalog}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-red-950/70 border border-red-500/50 hover:border-red-400 text-red-200 transition-all cursor-pointer shadow-sm group"
                  title="Bấm để mở Danh Mục Quản Lý Dự Án của AgentCorp"
                >
                  <FolderKanban className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
                  <span className="max-w-[130px] sm:max-w-[190px] truncate">{currentProjectTitle}</span>
                  <ChevronDown className="w-3 h-3 text-red-400 shrink-0" />
                </button>

                {onRenameProject && (
                  <button
                    onClick={onRenameProject}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="Đổi tên hoặc tự động đề xuất tên mới cho dự án này"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}

                {onQuickCreateProject && (
                  <button
                    onClick={onQuickCreateProject}
                    className="hidden lg:flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 transition-all"
                    title="Tạo dự án mới"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tạo Mới</span>
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Nền tảng Tác nhân Doanh nghiệp AI (Quản lý đa dự án & Tự động hoá phần mềm)
            </p>
          </div>
        </div>

        {/* Phase & System Status Pill with Discrete View Details */}
        <div className="relative">
          <div className="hidden md:flex items-center gap-2 bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Trạng thái:</span>
            <span className="font-semibold text-slate-200 truncate max-w-[130px]" title={activePhase}>
              {activePhase.length > 20 ? activePhase.slice(0, 20) + "..." : activePhase}
            </span>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => setShowDetailsPopover(!showDetailsPopover)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-[11px] font-medium text-slate-300 hover:text-white border border-slate-700/70 transition-all cursor-pointer shadow-sm"
              title="Bấm để xem chi tiết bộ não & thông số hệ thống"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Xem chi tiết</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Discrete Popover Details */}
          {showDetailsPopover && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDetailsPopover(false)}
              />
              <div className="absolute top-full left-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Thông Số Hệ Thống & Bộ Não
                    </h4>
                  </div>
                  <button
                    onClick={() => setShowDetailsPopover(false)}
                    className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Trạng thái công việc:</span>
                    <span className="font-semibold text-slate-200 mt-0.5 block break-words">
                      {activePhase}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Bộ não xử lý chính:</span>
                    <span className="font-bold text-cyan-300 text-[11px] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      Gemini 3.8 Flash
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Nhà cung cấp hiện tại:</span>
                    <span className="font-semibold text-slate-200 uppercase text-[11px]">
                      {aiSettings.activeProvider}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Bảo mật hiển thị:</span>
                    <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Chế độ kín đáo bật
                    </span>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setShowDetailsPopover(false);
                        onOpenAISettings();
                      }}
                      className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs text-center transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Mở bảng cấu hình chi tiết</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Direct Live App Portal Button for Active Project */}
          {onSwitchToCinema && (() => {
            const cat = (currentProjectCategory || "").toLowerCase();
            const title = (currentProjectTitle || "").toLowerCase();

            if (cat.includes("streaming") || cat.includes("media") || cat.includes("phim") || title.includes("motfilm")) {
              return (
                <button
                  onClick={onSwitchToCinema}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-md shadow-red-600/30 transition-all cursor-pointer border border-red-400/40"
                  title="Mở giao diện Web Phim độc lập thuần túy dành cho khán giả"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>🎬 Xem Web Phim (Live Demo)</span>
                </button>
              );
            }

            if (cat.includes("saas") || cat.includes("b2b") || title.includes("saas")) {
              return (
                <button
                  onClick={onSwitchToCinema}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer border border-indigo-400/40"
                  title="Mở bản chạy thử nền tảng SaaS AI B2B"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>⚡ Xem Nền Tảng SaaS AI</span>
                </button>
              );
            }

            if (cat.includes("crm") || cat.includes("cskh") || title.includes("cskh")) {
              return (
                <button
                  onClick={onSwitchToCinema}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white shadow-md shadow-cyan-600/30 transition-all cursor-pointer border border-cyan-400/40"
                  title="Mở bảng điều hành tổng đài CSKH AI"
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>🎧 Xem Tổng Đài CSKH AI</span>
                </button>
              );
            }

            return (
              <button
                onClick={onSwitchToCinema}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer border border-indigo-400/40"
                title="Mở bản chạy thử sản phẩm cho dự án này"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>🌐 Mở Bản Xem Thử Sản Phẩm</span>
              </button>
            );
          })()}

          {/* Direct Share with 12H Passcode Button */}
          {onOpenShareModal && (
            <button
              onClick={onOpenShareModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md shadow-amber-500/25 transition-all cursor-pointer border border-amber-300/40 active:scale-95"
              title="Chia sẻ link bản xem thử kèm mật khẩu tự reset sau 12h"
            >
              <Share2 className="w-3.5 h-3.5 fill-current" />
              <span>🔗 Chia Sẻ (Pass 12H)</span>
            </button>
          )}

          {/* Split Screen & Separate Window Links Button */}
          {onOpenSplitModal && (
            <button
              onClick={onOpenSplitModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/40 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Lấy link mở riêng 2 tab song song: 1 bên Hội Đồng AI, 1 bên Web Thành Phẩm"
            >
              <SplitSquareVertical className="w-3.5 h-3.5 text-cyan-400" />
              <span>🪟 Tách 2 Tab</span>
            </button>
          )}

          {/* Solution Inheritance Vault Button */}
          {onOpenBlueprintVault && (
            <button
              onClick={onOpenBlueprintVault}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 transition-all cursor-pointer shadow-sm"
              title="Kho thành tựu & Kế thừa kiến trúc cho dự án cùng phong cách"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">Kho Thành Tựu</span>
            </button>
          )}

          {/* Clean Standalone Packaging & Export Button */}
          {onOpenExportModal && (
            <button
              onClick={onOpenExportModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 transition-all cursor-pointer shadow-sm"
              title="Xuất mã nguồn độc lập, hướng dẫn đẩy lên Git và gói bàn giao thương mại"
            >
              <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Đóng Gói / Xuất Git</span>
              <span className="md:hidden">Xuất Git</span>
            </button>
          )}

          {/* TTS Voice Toggle */}
          <button
            onClick={() =>
              onUpdateAISettings({
                ...aiSettings,
                ttsEnabled: !aiSettings.ttsEnabled,
              })
            }
            title={aiSettings.ttsEnabled ? "Tắt đọc giọng nói" : "Bật đọc giọng nói"}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all ${
              aiSettings.ttsEnabled
                ? "bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-sm"
                : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200"
            }`}
          >
            {aiSettings.ttsEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Giọng nói: Bật</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Giọng nói: Tắt</span>
              </>
            )}
          </button>

          {/* Telegram Bot Button */}
          {telegramConnected ? (
            <button
              onClick={onOpenTelegramBot}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 shadow-sm transition-all"
              title={`Đã kết nối với @${telegramBotUsername || "Bot"}. Bấm để xem cài đặt`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">@{telegramBotUsername || "Bot"} (Đã kết nối)</span>
              <span className="sm:hidden">Bot OK</span>
            </button>
          ) : (
            <button
              onClick={onOpenTelegramBot}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 shadow-sm transition-all"
              title="Liên kết Telegram Bot để giao việc từ xa"
            >
              <Send className="w-3.5 h-3.5 text-blue-400 -rotate-45" />
              <span className="hidden sm:inline">Bot Telegram</span>
            </button>
          )}

          {/* Org Chart Button */}
          <button
            onClick={onOpenOrgChart}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sơ đồ Tổ chức</span>
          </button>

          {/* System Configuration Button (Discreet) */}
          <button
            onClick={onOpenAISettings}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Bấm để xem và chỉnh sửa cấu hình hệ thống"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Cấu hình</span>
          </button>

          {/* Master Report Button */}
          {hasSynthesis && (
            <button
              onClick={onOpenExecutiveReport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20 border border-emerald-400/30 transition-all animate-pulse"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Báo cáo CEO</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
