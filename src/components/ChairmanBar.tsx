import React, { useState } from "react";
import {
  Play,
  Pause,
  Send,
  Sparkles,
  FastForward,
  CheckCircle2,
  FileCheck,
  Crown,
  Tv,
} from "lucide-react";

interface ChairmanBarProps {
  isDebating: boolean;
  onToggleDebate: () => void;
  onNextDebateTurn: () => void;
  onExecuteAllTasks: () => void;
  onFinalizeSynthesis: () => void;
  onInjectChairmanNote: (note: string) => void;
  onOpenLivePreview?: () => void;
  hasTasks: boolean;
  hasDebateMessages: boolean;
  isExecutingTasks: boolean;
  isSynthesizing: boolean;
  taskCount: number;
  completedTaskCount: number;
}

export const ChairmanBar: React.FC<ChairmanBarProps> = ({
  isDebating,
  onToggleDebate,
  onNextDebateTurn,
  onExecuteAllTasks,
  onFinalizeSynthesis,
  onInjectChairmanNote,
  onOpenLivePreview,
  hasTasks,
  hasDebateMessages,
  isExecutingTasks,
  isSynthesizing,
  taskCount,
  completedTaskCount,
}) => {
  const [note, setNote] = useState("");

  const handleSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    onInjectChairmanNote(note.trim());
    setNote("");
  };

  return (
    <div className="rounded-2xl bg-slate-900/95 border border-indigo-500/30 p-4 shadow-2xl backdrop-blur-md">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Left: Chairman Directive Input */}
        <form onSubmit={handleSubmitNote} className="flex-1 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Crown className="w-4 h-4 text-amber-300" />
          </div>
          <div className="relative flex-1">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Chỉ đạo của Chủ tịch HĐQT (vd: 'Tập trung vào tính năng AI cốt lõi, hạn chế chi phí server')..."
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 transition-colors pr-10"
            />
            <button
              type="submit"
              disabled={!note.trim()}
              title="Gửi chỉ đạo tới phòng họp"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 disabled:opacity-30 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Right: Operational Controls */}
        <div className="flex flex-wrap items-center justify-end gap-2">
          {/* Pause / Resume Auto-Debate */}
          <button
            onClick={onToggleDebate}
            disabled={!hasTasks}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all disabled:opacity-40 ${
              isDebating
                ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40"
                : "bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border-indigo-500/40"
            }`}
          >
            {isDebating ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Tạm dừng tranh luận</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Tự động tranh luận</span>
              </>
            )}
          </button>

          {/* Next Single Turn */}
          <button
            onClick={onNextDebateTurn}
            disabled={isDebating || !hasTasks}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-40"
          >
            <FastForward className="w-3.5 h-3.5 text-indigo-400" />
            <span>Lượt tiếp theo</span>
          </button>

          {/* Execute All Subtasks */}
          <button
            onClick={onExecuteAllTasks}
            disabled={!hasTasks || isExecutingTasks}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/20 transition-all disabled:opacity-40"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isExecutingTasks
                ? "Đang sản xuất siêu tốc..."
                : completedTaskCount === taskCount && taskCount > 0
                ? `Xem Sản Phẩm & Code (${completedTaskCount}/${taskCount})`
                : `Thực thi WBS Siêu Tốc (${completedTaskCount}/${taskCount})`}
            </span>
          </button>

          {/* Direct Live Web Demo Button */}
          {completedTaskCount > 0 && onOpenLivePreview && (
            <button
              onClick={onOpenLivePreview}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-md shadow-indigo-500/25 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Xem Sản Phẩm Chạy Thử (Live Demo)</span>
            </button>
          )}

          {/* CEO Final Synthesis */}
          <button
            onClick={onFinalizeSynthesis}
            disabled={!hasTasks || isSynthesizing}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20 transition-all disabled:opacity-40"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>{isSynthesizing ? "CEO đang tổng kết..." : "Xuất Báo Cáo CEO"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
