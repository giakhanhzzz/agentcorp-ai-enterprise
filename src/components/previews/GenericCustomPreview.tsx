import React, { useState } from "react";
import {
  FolderKanban,
  Sparkles,
  Zap,
  Code2,
  Compass,
  CheckCircle2,
  Clock,
  Layers,
  Rocket,
  FileText,
  ExternalLink,
  Terminal,
} from "lucide-react";
import { CompanyTask, EnterpriseProject } from "../../types";

interface GenericCustomPreviewProps {
  project: EnterpriseProject;
  tasks: CompanyTask[];
  onOpenCode: () => void;
  onRequestIteration?: (directive: string) => void;
  onStartMission?: () => void;
  isStandalone?: boolean;
  onExitStandalone?: () => void;
}

export const GenericCustomPreview: React.FC<GenericCustomPreviewProps> = ({
  project,
  tasks,
  onOpenCode,
  onRequestIteration,
  onStartMission,
  isStandalone,
  onExitStandalone,
}) => {
  const [directive, setDirective] = useState("");
  const [isDiscoveryMode, setIsDiscoveryMode] = useState(true);

  const completedTasks = tasks.filter((t) => t.status === "completed");
  const hasDeliverables = completedTasks.some((t) => t.deliverable);

  const handleSubmitDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directive.trim() || !onRequestIteration) return;
    onRequestIteration(directive.trim());
    setDirective("");
  };

  return (
    <div className="space-y-6">
      {/* 1. Chairman Directive Bar tailored to this project */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-indigo-500/40 p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Phòng Điều Hành Trực Tiếp Của Chủ Tịch
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                  {project.category}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Chỉ Đạo Nâng Cấp Dự Án: {project.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Xem Cơ Cấu WBS ({tasks.length})</span>
            </button>
            {isStandalone && onExitStandalone && (
              <button
                onClick={onExitStandalone}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-semibold border border-red-800/80"
              >
                ✕ Thoát Toàn Màn Hình
              </button>
            )}
          </div>
        </div>

        {/* Input field */}
        <form onSubmit={handleSubmitDirective} className="flex gap-2">
          <input
            type="text"
            value={directive}
            onChange={(e) => setDirective(e.target.value)}
            placeholder={`Nhập yêu cầu nâng cấp cho "${project.name}" (vd: Bổ sung tính năng mới, kiểm thử bảo mật, đổi giao diện...)...`}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950/80 border border-indigo-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition-all"
          />
          <button
            type="submit"
            disabled={!directive.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-40"
          >
            <Sparkles className="w-4 h-4" />
            <span>Chỉ Đạo AI Ngay</span>
          </button>
        </form>

        {/* Market Discovery Radar */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDiscoveryMode(!isDiscoveryMode)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-bold"
            >
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>🌐 Radar Thị Trường ({project.category}): {isDiscoveryMode ? "BẬT" : "TẮT"}</span>
            </button>
            <span className="text-slate-400 text-[11px]">
              Tự động phân tích xu hướng và đối thủ cùng ngành
            </span>
          </div>

          <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Đang soi chiếu ngành: {project.category}</span>
          </div>
        </div>
      </div>

      {/* 2. Project Workspace Canvas */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl p-6 space-y-6">
        {hasDeliverables ? (
          /* When Tasks Have Produced Code / Artifacts */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Thành Phẩm & Mã Nguồn Của Dự Án: {project.name}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Đã hoàn thành {completedTasks.length} / {tasks.length} hạng mục trong cơ cấu công việc (WBS).
                </p>
              </div>
              <button
                onClick={onOpenCode}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
              >
                <Code2 className="w-4 h-4" />
                <span>Mở Toàn Bộ Code & Tài Liệu</span>
              </button>
            </div>

            {/* List Deliverables Produced for this project */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedTasks.filter(t => t.deliverable).map((task) => (
                <div key={task.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white truncate max-w-[260px]">{task.title}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                      Hoàn thành
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {task.deliverable?.deliverableTitle || task.description}
                  </p>
                  {task.deliverable?.artifacts && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {task.deliverable.artifacts.map((art, aIdx) => (
                        <span key={aIdx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-indigo-300">
                          {art.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Blank Canvas / Onboarding State for New Project */
          <div className="text-center max-w-xl mx-auto py-10 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto shadow-xl">
              <FolderKanban className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">Không Gian Dự Án: {project.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {project.description || "Dự án mới tạo đang ở trạng thái bản thảo sạch sẽ. Chưa có tác vụ nào chạy phân rã nhầm lẫn."}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left space-y-2 text-xs text-slate-300">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Quy trình vận hành độc lập cho dự án này:</span>
              </div>
              <ul className="space-y-1.5 text-slate-400 pl-4 list-disc text-[11px]">
                <li><strong>Bước 1:</strong> Bạn có thể đổi tên dự án hoặc tự đề xuất tên bất cứ lúc nào.</li>
                <li><strong>Bước 2:</strong> Nhập mục tiêu vào ô <em>"Chỉ Đạo Hội Đồng AI"</em> ở phía trên (nếu muốn AI bắt đầu họp bàn).</li>
                <li><strong>Bước 3:</strong> Hội đồng AI sẽ phản biện và xuất thành phẩm riêng cho dự án này mà không đụng chạm đến các dự án khác!</li>
              </ul>
            </div>

            {onStartMission && (
              <button
                onClick={onStartMission}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30"
              >
                <Rocket className="w-4 h-4" />
                <span>Khởi Động Hội Đồng AI Cho Dự Án Này</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
