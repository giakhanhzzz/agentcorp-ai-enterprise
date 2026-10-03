import React from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Play,
  FileCode,
  ArrowRight,
  Sparkles,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { CompanyTask, Agent, TaskStatus, TaskPriority } from "../types";

interface TaskBoardProps {
  tasks: CompanyTask[];
  agents: Agent[];
  onSelectTask: (task: CompanyTask) => void;
  onExecuteTask: (task: CompanyTask) => void;
  isExecutingAny: boolean;
}

const getPriorityBadge = (priority: TaskPriority) => {
  switch (priority) {
    case "critical":
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-red-500/20 text-red-400 border border-red-500/30">
          Khẩn cấp
        </span>
      );
    case "high":
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
          Ưu tiên cao
        </span>
      );
    case "medium":
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
          Bình thường
        </span>
      );
    default:
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-500/20 text-slate-400 border border-slate-500/30">
          Tiêu chuẩn
        </span>
      );
  }
};

const getStatusBadge = (status: TaskStatus) => {
  switch (status) {
    case "completed":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" />
          Đã bàn giao
        </span>
      );
    case "in_progress":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
          <Clock className="w-3 h-3 animate-spin" />
          Đang thực thi
        </span>
      );
    case "review":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
          <ShieldCheck className="w-3 h-3" />
          Thẩm định QA
        </span>
      );
    case "in_debate":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
          <Sparkles className="w-3 h-3" />
          Đang tranh luận
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
          Chờ xử lý
        </span>
      );
  }
};

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  agents,
  onSelectTask,
  onExecuteTask,
  isExecutingAny,
}) => {
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Header with Progress Bar */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
              <Layers className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Cơ Cấu Phân Rã Công Việc & Tiến Độ Thực Thi (WBS Kanban)
              </h3>
              <p className="text-xs text-slate-400">
                Các nhiệm vụ do CEO & Giám đốc Sản phẩm tự động phân rã và giao quyền cho từng Agent
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-300">
              Tiến độ: <strong className="text-emerald-400">{completedCount}/{tasks.length}</strong> ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Task Grid */}
      {tasks.length === 0 ? (
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-12 text-center text-slate-500">
          <Layers className="w-8 h-8 mx-auto mb-2 text-slate-600" />
          <p className="text-sm">Chưa có nhiệm vụ nào được phân bổ.</p>
          <p className="text-xs text-slate-600 mt-1">
            Hội đồng CEO sẽ tự động phân tích và tạo WBS ngay khi bạn gửi bài toán!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => {
            const assignedAgent = agents.find((a) => a.id === task.assignedAgentId);
            const isCompleted = task.status === "completed";

            return (
              <div
                key={task.id}
                onClick={() => {
                  if (isCompleted && task.deliverable) {
                    onSelectTask(task);
                  }
                }}
                className={`rounded-xl border p-4.5 flex flex-col justify-between transition-all relative ${
                  isCompleted
                    ? "bg-slate-900/90 border-emerald-500/40 shadow-sm cursor-pointer hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    {getPriorityBadge(task.priority)}
                    {getStatusBadge(task.status)}
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-sm font-bold text-slate-100 mb-1.5 leading-snug">
                    {task.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-3 mb-3">
                    {task.description}
                  </p>
                </div>

                <div>
                  {/* Department & Estimate */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 py-2 border-t border-slate-800/80 mb-3">
                    <span className="truncate max-w-[140px]" title={task.department}>
                      {task.department}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" />
                      {task.estimatedTime}
                    </span>
                  </div>

                  {/* Assigned Agent Footer */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full bg-gradient-to-tr ${
                          assignedAgent?.avatarColor || "from-slate-700 to-slate-800"
                        } flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}
                      >
                        {assignedAgent?.name.charAt(0) || "A"}
                      </div>
                      <div className="truncate max-w-[120px]">
                        <p className="text-xs font-semibold text-slate-200 truncate">
                          {assignedAgent?.name || "Tác nhân"}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {assignedAgent?.role.split("(")[0]}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    {isCompleted && task.deliverable ? (
                      <button
                        onClick={() => onSelectTask(task)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        <span>Xem kết quả</span>
                      </button>
                    ) : (
                      <button
                        disabled={isExecutingAny}
                        onClick={() => onExecuteTask(task)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 transition-colors disabled:opacity-50"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Thực thi</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
