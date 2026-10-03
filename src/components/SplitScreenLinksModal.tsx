import React, { useState } from "react";
import {
  ExternalLink,
  Copy,
  Check,
  X,
  Bot,
  Globe,
  SplitSquareVertical,
  Monitor,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { getSafeOrigin, copyToClipboardSafely } from "../utils/shareSecurity";

interface SplitScreenLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
}

export const SplitScreenLinksModal: React.FC<SplitScreenLinksModalProps> = ({
  isOpen,
  onClose,
  projectName = "Motfilm Pro 4K",
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copyToast, setCopyToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const origin = getSafeOrigin();
  const agentCorpUrl = `${origin}/?mode=boardroom#boardroom`;
  const webAppUrl = `${origin}/?mode=movie#movie`;

  const handleCopy = async (text: string, key: string, label: string = "liên kết") => {
    await copyToClipboardSafely(text);
    setCopiedKey(key);
    setCopyToast(`Đã sao chép ${label} thành công!`);
    setTimeout(() => {
      setCopiedKey(null);
      setCopyToast(null);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-600/30">
              <SplitSquareVertical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base">Lấy Link Tách Cửa Sổ (Mở 2 Tab Song Song)</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                  Split Screen
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Xem phòng họp AI ở một bên và trang Web chạy ở một bên riêng biệt
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Top banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/50 via-slate-900 to-indigo-950/50 border border-blue-500/30 flex items-start gap-3">
            <Monitor className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-slate-300 leading-relaxed text-xs">
              <strong>Cách làm việc song song chuyên nghiệp nhất:</strong> Mở link <strong>Phòng Hội Đồng AI</strong> ở một tab, và mở link <strong>Web Thành Phẩm</strong> ở tab kế bên. Sau đó kéo 2 tab sang 2 nửa màn hình (trái & phải) để vừa ra lệnh cho AI vừa thấy web cập nhật tức thì!
            </div>
          </div>

          {/* 2 Main Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: AgentCorp Boardroom */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/40 space-y-3 flex flex-col justify-between hover:border-indigo-400 transition-colors shadow-lg shadow-indigo-950/30">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <Bot className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white text-sm">1. Phòng Điều Hành Agent</span>
                  </div>
                  <span className="text-[10px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-medium">
                    Hội đồng 7 AI
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Chỉ chứa phòng họp CEO, CTO, Architect, QA, tranh luận trực tiếp và danh sách công việc.
                </p>
                <div className="p-2 rounded-lg bg-black/70 border border-slate-800 font-mono text-[10px] text-indigo-300 break-all select-all">
                  {agentCorpUrl}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <a
                  href={agentCorpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-indigo-600/30"
                >
                  <span>Mở Tab Mới</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => handleCopy(agentCorpUrl, "agent-url")}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1 transition-colors shrink-0"
                  title="Sao chép đường link"
                >
                  {copiedKey === "agent-url" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedKey === "agent-url" ? "Đã chép" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Card 2: Standalone Live Web App */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3 flex flex-col justify-between hover:border-emerald-400 transition-colors shadow-lg shadow-emerald-950/30">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white text-sm">2. Web Thành Phẩm Độc Lập</span>
                  </div>
                  <span className="text-[10px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                    Toàn màn hình
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Trang web chạy thật (xem phim 4K, tìm kiếm, giỏ hàng). Đã giấu sạch giao diện AI.
                </p>
                <div className="p-2 rounded-lg bg-black/70 border border-slate-800 font-mono text-[10px] text-emerald-300 break-all select-all">
                  {webAppUrl}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <a
                  href={webAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-600/30"
                >
                  <span>Mở Tab Mới</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => handleCopy(webAppUrl, "web-url")}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1 transition-colors shrink-0"
                  title="Sao chép đường link"
                >
                  {copiedKey === "web-url" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedKey === "web-url" ? "Đã chép" : "Copy"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Guide on Split Screen */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">💡 Phím tắt chia đôi màn hình:</span>
              <span>Windows bấm <strong>Win + Mũi tên Trái/Phải</strong> • Mac giữ nút xanh góc trên cửa sổ</span>
            </div>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
