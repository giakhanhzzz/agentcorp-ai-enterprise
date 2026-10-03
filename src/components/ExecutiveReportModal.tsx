import React, { useState } from "react";
import {
  X,
  FileCheck,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Award,
  ArrowRight,
  Printer,
  Sparkles,
} from "lucide-react";
import { FinalSynthesis } from "../types";

interface ExecutiveReportModalProps {
  synthesis: FinalSynthesis | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  synthesis,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !synthesis) return null;

  const handleCopy = () => {
    const fullText = `# ${synthesis.masterPlanTitle}\n\n**Lời phê duyệt của CEO:** ${synthesis.ceoVerdict}\n**Điểm sẵn sàng:** ${synthesis.readinessScore}/100\n\n## Các bước triển khai tiếp theo:\n${synthesis.nextSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n${synthesis.synthesisMarkdown}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const fullText = `# ${synthesis.masterPlanTitle}\n\n**Lời phê duyệt của CEO:** ${synthesis.ceoVerdict}\n**Điểm sẵn sàng:** ${synthesis.readinessScore}/100\n\n## Các bước triển khai tiếp theo:\n${synthesis.nextSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n${synthesis.synthesisMarkdown}`;
    const blob = new Blob([fullText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AgentCorp_Master_Dossier_${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Nghị Quyết Hội Đồng Quản Trị
                </span>
                <span className="text-xs text-slate-500">
                  {synthesis.generatedAt}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {synthesis.masterPlanTitle}
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

        {/* Executive Score & Verdict Banner */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-950 via-indigo-950/30 to-slate-950 border-b border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Readiness Score Gauge */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-extrabold text-lg text-emerald-400">
              {synthesis.readinessScore}%
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Chỉ số sẵn sàng (Readiness)
              </span>
              <span className="text-xs font-semibold text-emerald-300">
                {synthesis.readinessScore >= 80 ? "Sẵn sàng triển khai" : "Cần tinh chỉnh thêm"}
              </span>
            </div>
          </div>

          {/* CEO Verdict */}
          <div className="md:col-span-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
              Phê chuẩn & Kết luận của CEO:
            </span>
            <p className="text-xs text-slate-200 italic leading-relaxed">
              &quot;{synthesis.ceoVerdict}&quot;
            </p>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6 bg-slate-950/40">
          {/* Next Steps Checklist */}
          {synthesis.nextSteps && synthesis.nextSteps.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Các bước hành động trọng tâm (Actionable Next Steps):</span>
              </h4>
              <div className="space-y-2">
                {synthesis.nextSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Markdown Dossier */}
          <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="prose prose-invert prose-sm max-w-none text-slate-200 font-sans leading-relaxed whitespace-pre-wrap">
              {synthesis.synthesisMarkdown}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/90">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Hồ sơ dự án tổng hợp từ toàn bộ các tác nhân chuyên trách
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Đã chép Markdown" : "Sao chép Markdown"}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải Hồ Sơ (.md)</span>
            </button>
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors hidden sm:block"
              title="In báo cáo"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
