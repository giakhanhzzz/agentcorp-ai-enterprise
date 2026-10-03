import React, { useRef, useEffect, useState } from "react";
import {
  Crown,
  Compass,
  Cpu,
  Sparkles,
  ShieldAlert,
  BarChart3,
  User,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  Flame,
  Download,
  Globe,
  FileCode,
  Zap,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Agent, DebateMessage, DebateSentiment } from "../types";
import { agentVoice } from "../utils/speech";

interface BoardroomProps {
  agents: Agent[];
  messages: DebateMessage[];
  currentSpeakerId: string | null;
  isDebating: boolean;
  topic: string;
  ttsEnabled: boolean;
  onOpenExportModal?: () => void;
}

const getRoleIcon = (iconName: string) => {
  switch (iconName) {
    case "Crown":
      return <Crown className="w-5 h-5 text-amber-300" />;
    case "Compass":
      return <Compass className="w-5 h-5 text-blue-300" />;
    case "Cpu":
      return <Cpu className="w-5 h-5 text-violet-300" />;
    case "Sparkles":
      return <Sparkles className="w-5 h-5 text-pink-300" />;
    case "ShieldAlert":
      return <ShieldAlert className="w-5 h-5 text-emerald-300" />;
    case "BarChart3":
      return <BarChart3 className="w-5 h-5 text-teal-300" />;
    default:
      return <User className="w-5 h-5 text-slate-300" />;
  }
};

const getSentimentBadge = (sentiment: DebateSentiment) => {
  switch (sentiment) {
    case "critical":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30">
          <AlertTriangle className="w-3 h-3 text-rose-400" />
          Phản biện / Bất đồng
        </span>
      );
    case "constructive":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          Đồng thuận / Xây dựng
        </span>
      );
    case "enthusiastic":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
          <Flame className="w-3 h-3 text-amber-400" />
          Đột phá / Đổi mới
        </span>
      );
    case "cautious":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
          <Lightbulb className="w-3 h-3 text-blue-400" />
          Cẩn trọng / Đo lường
        </span>
      );
    default:
      return null;
  }
};

export const Boardroom: React.FC<BoardroomProps> = ({
  agents,
  messages,
  currentSpeakerId,
  isDebating,
  topic,
  ttsEnabled,
  onOpenExportModal,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isZipping, setIsZipping] = useState(false);
  const [showBypassHelp, setShowBypassHelp] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentSpeakerId]);

  const activeSpeaker = agents.find((a) => a.id === currentSpeakerId);

  const handleDownloadZip = () => {
    setIsZipping(true);
    const link = document.createElement("a");
    link.href = "/api/export-project-zip";
    link.download = `motfilm-pro-complete-${Date.now()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsZipping(false), 3000);
  };

  const handleDownloadStandaloneHtml = () => {
    const link = document.createElement("a");
    link.href = "/api/export-standalone-html";
    link.download = "motfilm-pro-standalone-player.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Visual Circular Conference Table / War Room Stage */}
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-6 overflow-hidden shadow-2xl">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 right-10 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Boardroom Header Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
              <h2 className="text-base font-bold text-white tracking-wide">
                Hội Đồng Quản Trị & Ban Điều Hành AI (War Room)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {topic ? `Chủ đề: ${topic}` : "Sẵn sàng khởi động phiên làm việc tự chủ"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-cyan-950/50 text-cyan-300 border border-cyan-500/30">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Động cơ: <strong>Gemini 3.8 Flash</strong></span>
            </span>
            <span className="px-2.5 py-1 text-xs rounded-md bg-slate-800/80 text-slate-300 border border-slate-700">
              Tổng số tác nhân: <strong className="text-indigo-300">{agents.length}</strong>
            </span>
            <span className="px-2.5 py-1 text-xs rounded-md bg-slate-800/80 text-slate-300 border border-slate-700">
              Lượt phát biểu: <strong className="text-indigo-300">{messages.length}</strong>
            </span>
          </div>
        </div>

        {/* The Digital Round Table */}
        <div className="relative my-4 py-8 flex items-center justify-center">
          {/* Table Center Hub */}
          <div className="w-48 sm:w-64 h-24 sm:h-32 rounded-3xl bg-slate-900/80 border border-indigo-500/30 flex flex-col items-center justify-center p-3 text-center shadow-inner relative z-0">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mb-1 ring-1 ring-indigo-400/40">
              <Sparkles className="w-4 h-4 text-indigo-300 animate-spin" style={{ animationDuration: "8s" }} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
              Trung Tâm Ra Quyết Định
            </span>
            <span className="text-[10px] text-slate-400 max-w-[180px] truncate">
              {isDebating
                ? activeSpeaker
                  ? `${activeSpeaker.name} đang phát biểu...`
                  : "Các tác nhân đang suy nghĩ..."
                : "Hội đồng đang chờ bài toán mới"}
            </span>
          </div>

          {/* Floating Agent Seats around the perimeter */}
          <div className="absolute inset-0 flex items-center justify-around flex-wrap gap-4 pointer-events-none">
            {agents.map((agent) => {
              const isCurrent = agent.id === currentSpeakerId;
              return (
                <div
                  key={agent.id}
                  className={`pointer-events-auto flex flex-col items-center transition-all duration-300 ${
                    isCurrent
                      ? "scale-110 z-20"
                      : "opacity-85 hover:opacity-100 hover:scale-105 z-10"
                  }`}
                >
                  <div
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr ${agent.avatarColor} p-0.5 shadow-lg transition-all ${
                      isCurrent
                        ? "ring-4 ring-indigo-400 ring-offset-2 ring-offset-slate-950 shadow-indigo-500/50"
                        : "ring-1 ring-white/10"
                    }`}
                  >
                    <div className="w-full h-full rounded-[14px] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
                      {getRoleIcon(agent.avatarIcon)}
                    </div>
                    {isCurrent && (
                      <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[9px] text-white font-bold items-center justify-center">
                          ●
                        </span>
                      </span>
                    )}
                  </div>
                  <div className="text-center mt-1.5 max-w-[90px] sm:max-w-[110px]">
                    <p className="text-[11px] font-bold text-slate-200 truncate">{agent.name}</p>
                    <p className="text-[9px] text-slate-400 truncate">{agent.role.split("(")[0]}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ⚡ ARGENT PROTOCOL & DEVOPS AUTONOMOUS TOOL (IAP BYPASS & 1-CLICK DEPLOY) */}
      <div className="rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/40 border border-rose-500/30 p-4 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-extrabold text-white">
                  Bộ Công Cụ Tác Nhân Argent & DevOps: Thoát Ly Google IAP (Triển Khai Độc Lập)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px] border border-rose-500/30">
                  Argent Tool v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Phụ trách chuyên biệt: <strong>Lâm Quốc Bảo</strong> (Argent Profiler & Hacker) & <strong>Đoàn Thu Hương</strong> (DevOps Cloud)
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowBypassHelp(!showBypassHelp)}
            className="text-[11px] text-rose-300 hover:text-white flex items-center gap-1 shrink-0 self-start sm:self-auto bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1 rounded-lg border border-rose-500/30 transition-all cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>{showBypassHelp ? "Ẩn giải trình an ninh" : "Vì sao Tab Ẩn Danh bị Google chặn?"}</span>
          </button>
        </div>

        {/* Expandable Explanation of Google Cloud IAP */}
        {showBypassHelp && (
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-rose-500/30 text-xs text-slate-300 space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 text-rose-300 font-bold">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Báo Cáo Tác Chiến Của Hacker Lâm Quốc Bảo (Argent Protocol):</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Các đường link preview đuôi <code>*.run.app</code> nằm sau tường lửa <strong>Google Cloud IAP (Identity-Aware Proxy)</strong>. Khi bạn mở trong <strong>Tab Ẩn Danh</strong> hoặc gửi sang điện thoại của bạn bè, Google IAP phát hiện không có cookie đăng nhập của bạn, lập tức chặn ngang và chuyển hướng về trang Google Studio.
            </p>
            <p className="text-[11px] text-emerald-300 font-semibold leading-relaxed">
              👉 <strong>Hành động đề xuất:</strong> Bạn chỉ cần dùng 1 trong 2 công cụ bên dưới của Tác nhân để lấy web ra ngoài Google. Khi đã lên Vercel hoặc mở file HTML, bất kỳ ai cũng xem phim được ngay 100%!
            </p>
          </div>
        )}

        {/* Action Buttons for Argent Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Tool 1: Standalone HTML */}
          <button
            onClick={handleDownloadStandaloneHtml}
            className="p-2.5 rounded-xl bg-gradient-to-r from-purple-900/60 to-indigo-900/60 hover:from-purple-800/80 hover:to-indigo-800/80 border border-purple-500/40 text-left transition-all group cursor-pointer shadow-md"
          >
            <div className="flex items-center justify-between text-purple-300 mb-1">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <FileCode className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <span>1. Tải HTML Standalone</span>
              </div>
              <span className="text-[10px] bg-purple-500/20 px-1.5 py-0.2 rounded font-semibold text-purple-200">0 Cần Server</span>
            </div>
            <p className="text-[10px] text-slate-400 line-clamp-2">
              File HTML chạy ngay trên máy tính/điện thoại, 100% không dính Google IAP.
            </p>
          </button>

          {/* Tool 2: Full Source ZIP */}
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-900/60 to-teal-900/60 hover:from-emerald-800/80 hover:to-teal-800/80 border border-emerald-500/40 text-left transition-all group cursor-pointer disabled:opacity-50 shadow-md"
          >
            <div className="flex items-center justify-between text-emerald-300 mb-1">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <Download className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>2. Tải Trọn Bộ ZIP</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.2 rounded font-semibold text-emerald-200">
                {isZipping ? "Đang nén..." : "Deploy Vercel"}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 line-clamp-2">
              Sẵn sàng kéo thả vào Vercel / Cloudflare Pages trong 60 giây.
            </p>
          </button>

          {/* Tool 3: Open Deploy & DMCA Modal */}
          {onOpenExportModal && (
            <button
              onClick={onOpenExportModal}
              className="p-2.5 rounded-xl bg-gradient-to-r from-blue-900/60 to-cyan-900/60 hover:from-blue-800/80 hover:to-cyan-800/80 border border-blue-500/40 text-left transition-all group cursor-pointer shadow-md"
            >
              <div className="flex items-center justify-between text-cyan-300 mb-1">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Globe className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>3. Hướng Dẫn & DMCA</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-2">
                Quy trình 3 bước lên Vercel miễn phí & chứng minh pháp lý 0 vi phạm bản quyền.
              </p>
            </button>
          )}
        </div>
      </div>

      {/* 2. Live Debate Transcript / Speech Stream */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-200">
              Biên Bản Tranh Luận & Trao Đổi Trực Tiếp (Live Stream)
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Tự động ghi chép và trích xuất hành động
          </span>
        </div>

        {/* Message List */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <p>Chưa có phiên tranh luận nào được kích hoạt.</p>
              <p className="text-xs text-slate-600 mt-1">
                Hãy nhập bài toán và nhấn &quot;Khởi Động Hội Đồng AI&quot; để các tác nhân bắt đầu thảo luận!
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const speaker = agents.find((a) => a.id === msg.agentId);
              return (
                <div
                  key={msg.id || index}
                  className="rounded-xl bg-slate-950/70 border border-slate-800/80 p-4 hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${
                          speaker?.avatarColor || "from-slate-700 to-slate-800"
                        } flex items-center justify-center p-0.5`}
                      >
                        <div className="w-full h-full rounded-[6px] bg-slate-900 flex items-center justify-center">
                          {speaker ? getRoleIcon(speaker.avatarIcon) : <User className="w-4 h-4" />}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-100">{msg.agentName}</span>
                          <span className="text-[10px] text-indigo-400 font-medium bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                            {msg.role}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getSentimentBadge(msg.sentiment)}
                      {/* Play TTS button */}
                      <button
                        onClick={() => agentVoice.speak(msg.speech, msg.agentId)}
                        title="Nghe lại phát biểu này"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Thinking Logic Box */}
                  {msg.thinking && (
                    <div className="mb-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800/60 text-[11px] text-slate-400 flex items-start gap-2 italic">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Suy nghĩ nội bộ:</strong> {msg.thinking}
                      </span>
                    </div>
                  )}

                  {/* Agent Main Speech */}
                  <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap pl-1">
                    {msg.speech}
                  </p>

                  {/* Action Proposal */}
                  {msg.actionProposal && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center gap-2 text-xs text-indigo-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>
                        <strong>Đề xuất hành động:</strong> {msg.actionProposal}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Active Speaking Indicator */}
          {isDebating && activeSpeaker && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 animate-pulse">
              <div
                className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${activeSpeaker.avatarColor} flex items-center justify-center`}
              >
                {getRoleIcon(activeSpeaker.avatarIcon)}
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-indigo-200">
                  {activeSpeaker.name} ({activeSpeaker.role}) đang phân tích và chuẩn bị phát biểu...
                </p>
                <div className="flex gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};
