import React, { useState } from "react";
import {
  X,
  FileCode,
  Copy,
  Check,
  Download,
  FileText,
  User,
  Calendar,
  Layers,
} from "lucide-react";
import { CompanyTask, TaskArtifact } from "../types";

interface DeliverableModalProps {
  task: CompanyTask | null;
  onClose: () => void;
}

export const DeliverableModal: React.FC<DeliverableModalProps> = ({
  task,
  onClose,
}) => {
  if (!task || !task.deliverable) return null;

  const { deliverable } = task;
  const [activeTab, setActiveTab] = useState<"report" | string>("report");
  const [copied, setCopied] = useState(false);

  const activeArtifact = deliverable.artifacts.find((a) => a.name === activeTab);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <FileCode className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Sản phẩm bàn giao chính thức
                </span>
                <span className="text-xs text-slate-400">
                  {deliverable.completedAt}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                {deliverable.deliverableTitle}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-header with Agent Details */}
        <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span>Thực hiện bởi:</span>
            <strong className="text-slate-200">{deliverable.agentName}</strong>
            <span className="text-slate-500">({deliverable.agentRole})</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Nhiệm vụ gốc:</span>
            <strong className="text-slate-200">{task.title}</strong>
          </div>
        </div>

        {/* Artifacts Tab Switcher */}
        <div className="px-6 pt-3 border-b border-slate-800 flex items-center gap-2 overflow-x-auto bg-slate-950/40">
          <button
            onClick={() => setActiveTab("report")}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "report"
                ? "border-indigo-500 text-indigo-300 bg-slate-850"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Báo cáo & Phân tích</span>
          </button>

          {deliverable.artifacts.map((art) => (
            <button
              key={art.name}
              onClick={() => setActiveTab(art.name)}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === art.name
                  ? "border-emerald-500 text-emerald-300 bg-slate-850"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{art.name}</span>
            </button>
          ))}
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-950/50">
          {activeTab === "report" ? (
            <div className="space-y-4">
              {deliverable.executiveNotes && (
                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200">
                  <strong className="block text-indigo-100 font-semibold mb-1">
                    Ghi chú điều hành (Executive Notes):
                  </strong>
                  {deliverable.executiveNotes}
                </div>
              )}

              <div className="prose prose-invert prose-sm max-w-none text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
                {deliverable.content}
              </div>
            </div>
          ) : activeArtifact ? (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <span className="text-xs font-mono text-emerald-400">
                  {activeArtifact.name} ({activeArtifact.type.toUpperCase()})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(activeArtifact.data || activeArtifact.content || "")}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Đã chép" : "Sao chép"}</span>
                  </button>
                  <button
                    onClick={() => handleDownload(activeArtifact.name, activeArtifact.data || activeArtifact.content || "")}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải về</span>
                  </button>
                </div>
              </div>
              <pre className="flex-1 p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
                <code>{activeArtifact.data || activeArtifact.content || ""}</code>
              </pre>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/80">
          <span className="text-xs text-slate-500">
            Tổng cộng: {deliverable.artifacts.length} tệp artifact đính kèm
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(deliverable.content)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Sao chép toàn bộ</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
